import { DaemonMessage } from "@terragon/daemon/shared";
import { ISandboxSession } from "@terragon/sandbox/types";
import { sendMessage } from "@terragon/sandbox/daemon";
import { setActiveThreadChat } from "./sandbox-resource";
import { wrapError } from "./error";
import { getFeatureFlagsForUser } from "@terragon/shared/model/feature-flags";
import { db } from "@/lib/db";
import { env } from "@terragon/env/apps-www";

type DistributiveOmit<T, K extends PropertyKey> = T extends any
  ? Omit<T, K>
  : never;

export async function sendDaemonMessage({
  message,
  userId,
  threadId,
  threadChatId,
  sandboxId,
  session,
}: {
  message: DistributiveOmit<
    Extract<DaemonMessage, { type: "claude" | "stop" }>,
    "token" | "threadId" | "threadChatId" | "featureFlags"
  >;
  threadId: string;
  userId: string;
  threadChatId: string;
  sandboxId: string;
  session: ISandboxSession;
}) {
  try {
    await setActiveThreadChat({ sandboxId, threadChatId, isActive: true });
    const featureFlags = await getFeatureFlagsForUser({ db, userId });

    const baseMessage = {
      ...message,
      token: env.INTERNAL_SHARED_SECRET,
      threadId,
      threadChatId,
    };

    const finalMessage: DaemonMessage =
      baseMessage.type === "claude"
        ? {
            ...baseMessage,
            featureFlags: featureFlags,
          }
        : baseMessage;

    await sendMessage({
      session,
      message: finalMessage,
    });
  } catch (error) {
    throw wrapError("agent-not-responding", error);
  }
}
