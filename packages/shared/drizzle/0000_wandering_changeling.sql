CREATE TABLE "agent_provider_credentials" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"agent" text NOT NULL,
	"type" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"api_key_encrypted" text,
	"access_token_encrypted" text,
	"refresh_token_encrypted" text,
	"id_token_encrypted" text,
	"expires_at" timestamp,
	"last_refreshed_at" timestamp,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "amp_auth" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"amp_api_key_encrypted" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "amp_auth_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "automations" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"enabled" boolean DEFAULT true NOT NULL,
	"trigger_type" text NOT NULL,
	"trigger_config" jsonb NOT NULL,
	"repo_full_name" text NOT NULL,
	"branch_name" text NOT NULL,
	"action" jsonb NOT NULL,
	"skip_setup" boolean DEFAULT false NOT NULL,
	"disable_git_checkpointing" boolean DEFAULT false NOT NULL,
	"last_run_at" timestamp,
	"next_run_at" timestamp,
	"run_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "claude_oauth_tokens" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"is_subscription" boolean DEFAULT true NOT NULL,
	"anthropic_api_key_encrypted" text,
	"access_token_encrypted" text NOT NULL,
	"token_type" text NOT NULL,
	"expires_at" timestamp,
	"refresh_token_encrypted" text,
	"scope" text,
	"is_max" boolean DEFAULT false NOT NULL,
	"organization_type" text,
	"account_id" text,
	"account_email" text,
	"org_id" text,
	"org_name" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "claude_oauth_tokens_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "claude_session_checkpoints" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"thread_id" text NOT NULL,
	"session_id" text NOT NULL,
	"r2_key" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "environment" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"is_global" boolean DEFAULT false NOT NULL,
	"repo_full_name" text NOT NULL,
	"environment_variables" jsonb DEFAULT '[]'::jsonb,
	"mcp_config_encrypted" text,
	"setup_script" text,
	"disable_git_checkpointing" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "feature_flags" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"default_value" boolean NOT NULL,
	"global_override" boolean,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "feedback" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"type" text NOT NULL,
	"message" text NOT NULL,
	"current_page" text NOT NULL,
	"resolved" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "gemini_auth" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"token_type" text NOT NULL,
	"gemini_api_key_encrypted" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "gemini_auth_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "github_check_run" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"thread_id" text,
	"thread_chat_id" text,
	"check_run_id" bigint NOT NULL,
	"status" text DEFAULT 'queued' NOT NULL,
	"conclusion" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "github_pr" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"repo_full_name" text NOT NULL,
	"number" integer NOT NULL,
	"status" text DEFAULT 'open' NOT NULL,
	"base_ref" text,
	"mergeable_state" text DEFAULT 'unknown',
	"checks_status" text DEFAULT 'unknown',
	"thread_id" text,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "openai_auth" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"openai_api_key_encrypted" text,
	"access_token_encrypted" text,
	"refresh_token_encrypted" text,
	"id_token_encrypted" text,
	"account_id" text,
	"expires_at" timestamp,
	"last_refreshed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "openai_auth_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "slack_account" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"team_id" text NOT NULL,
	"slack_user_id" text NOT NULL,
	"slack_team_name" text NOT NULL,
	"slack_team_domain" text NOT NULL,
	"access_token_encrypted" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "slack_account_slack_user_id_unique" UNIQUE("slack_user_id")
);
--> statement-breakpoint
CREATE TABLE "slack_installation" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"team_id" text NOT NULL,
	"team_name" text NOT NULL,
	"bot_user_id" text NOT NULL,
	"bot_access_token_encrypted" text NOT NULL,
	"scope" text NOT NULL,
	"app_id" text NOT NULL,
	"installer_user_id" text,
	"is_enterprise_install" boolean DEFAULT false NOT NULL,
	"enterprise_id" text,
	"enterprise_name" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "slack_installation_team_id_unique" UNIQUE("team_id")
);
--> statement-breakpoint
CREATE TABLE "slack_settings" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"team_id" text NOT NULL,
	"default_repo_full_name" text,
	"default_model" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "thread" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"name" text,
	"github_repo_full_name" text NOT NULL,
	"repo_base_branch_name" text NOT NULL,
	"current_branch_name" text,
	"github_pr_number" integer,
	"github_issue_number" integer,
	"codesandbox_id" text,
	"sandbox_provider" text DEFAULT 'e2b' NOT NULL,
	"sandbox_size" text,
	"sandbox_status" text,
	"booting_substatus" text,
	"git_diff" text,
	"git_diff_stats" jsonb,
	"archived" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"automation_id" text,
	"parent_thread_id" text,
	"parent_tool_id" text,
	"draft_message" jsonb,
	"disable_git_checkpointing" boolean DEFAULT false NOT NULL,
	"skip_setup" boolean DEFAULT false NOT NULL,
	"source_type" text,
	"source_metadata" jsonb,
	"version" integer DEFAULT 0 NOT NULL,
	"agent" text DEFAULT 'claudeCode' NOT NULL,
	"agent_version" integer DEFAULT 0 NOT NULL,
	"status" text DEFAULT 'queued' NOT NULL,
	"messages" jsonb,
	"queued_messages" jsonb,
	"session_id" text,
	"error_message" text,
	"error_message_info" text,
	"schedule_at" timestamp,
	"reattempt_queue_at" timestamp,
	"context_length" integer,
	"permission_mode" text DEFAULT 'allowAll'
);
--> statement-breakpoint
CREATE TABLE "thread_chat" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"thread_id" text NOT NULL,
	"title" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"agent" text DEFAULT 'claudeCode' NOT NULL,
	"agent_version" integer DEFAULT 0 NOT NULL,
	"status" text DEFAULT 'queued' NOT NULL,
	"messages" jsonb,
	"queued_messages" jsonb,
	"session_id" text,
	"error_message" text,
	"error_message_info" text,
	"schedule_at" timestamp,
	"reattempt_queue_at" timestamp,
	"context_length" integer,
	"permission_mode" text DEFAULT 'allowAll'
);
--> statement-breakpoint
CREATE TABLE "thread_chat_read_status" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"thread_id" text NOT NULL,
	"thread_chat_id" text NOT NULL,
	"is_read" boolean DEFAULT true NOT NULL,
	"last_read_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "thread_read_status" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"thread_id" text NOT NULL,
	"is_read" boolean DEFAULT true NOT NULL,
	"last_read_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "thread_visibility" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"thread_id" text NOT NULL,
	"visibility" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "thread_visibility_thread_id_unique" UNIQUE("thread_id")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean NOT NULL,
	"image" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"role" text,
	"banned" boolean,
	"ban_reason" text,
	"ban_expires" timestamp,
	"shadow_banned" boolean DEFAULT false NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "user_feature_flags" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"feature_flag_id" text NOT NULL,
	"value" boolean NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_flags" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"has_seen_onboarding" boolean DEFAULT false NOT NULL,
	"show_debug_tools" boolean DEFAULT false NOT NULL,
	"is_claude_max_sub" boolean DEFAULT false NOT NULL,
	"is_claude_sub" boolean DEFAULT false NOT NULL,
	"claude_organization_type" text,
	"selected_model" text,
	"selected_models" jsonb,
	"multi_agent_mode" boolean DEFAULT false NOT NULL,
	"selected_repo" text,
	"selected_branch" text,
	"last_seen_release_notes" timestamp,
	"last_seen_release_notes_version" integer,
	"last_seen_feature_upsell_version" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_info_server_side" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"auto_reload_last_attempt_at" timestamp,
	"auto_reload_last_failure_at" timestamp,
	"auto_reload_last_failure_code" text,
	"stripe_credit_payment_method_id" text
);
--> statement-breakpoint
CREATE TABLE "user_settings" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"auto_push_branches" boolean DEFAULT false NOT NULL,
	"auto_create_draft_prs" boolean DEFAULT true NOT NULL,
	"auto_archive_merged_prs" boolean DEFAULT true NOT NULL,
	"auto_close_draft_prs_on_archive" boolean DEFAULT false NOT NULL,
	"branch_name_prefix" text DEFAULT 'terragon/' NOT NULL,
	"pr_type" text DEFAULT 'draft' NOT NULL,
	"sandbox_provider" text DEFAULT 'default' NOT NULL,
	"sandbox_size" text,
	"custom_system_prompt" text,
	"default_thread_visibility" text DEFAULT 'repo' NOT NULL,
	"preview_features_opt_in" boolean DEFAULT false NOT NULL,
	"single_thread_for_github_mentions" boolean DEFAULT true NOT NULL,
	"default_github_mention_model" text,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"auto_reload_disabled" boolean DEFAULT false NOT NULL,
	"agent_model_preferences" jsonb
);
--> statement-breakpoint
ALTER TABLE "agent_provider_credentials" ADD CONSTRAINT "agent_provider_credentials_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "amp_auth" ADD CONSTRAINT "amp_auth_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "automations" ADD CONSTRAINT "automations_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "claude_oauth_tokens" ADD CONSTRAINT "claude_oauth_tokens_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "claude_session_checkpoints" ADD CONSTRAINT "claude_session_checkpoints_thread_id_thread_id_fk" FOREIGN KEY ("thread_id") REFERENCES "public"."thread"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "environment" ADD CONSTRAINT "environment_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "feedback" ADD CONSTRAINT "feedback_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gemini_auth" ADD CONSTRAINT "gemini_auth_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "github_check_run" ADD CONSTRAINT "github_check_run_thread_id_thread_id_fk" FOREIGN KEY ("thread_id") REFERENCES "public"."thread"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "github_check_run" ADD CONSTRAINT "github_check_run_thread_chat_id_thread_chat_id_fk" FOREIGN KEY ("thread_chat_id") REFERENCES "public"."thread_chat"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "github_pr" ADD CONSTRAINT "github_pr_thread_id_thread_id_fk" FOREIGN KEY ("thread_id") REFERENCES "public"."thread"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "openai_auth" ADD CONSTRAINT "openai_auth_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "slack_account" ADD CONSTRAINT "slack_account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "slack_settings" ADD CONSTRAINT "slack_settings_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "thread" ADD CONSTRAINT "thread_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "thread" ADD CONSTRAINT "thread_automation_id_automations_id_fk" FOREIGN KEY ("automation_id") REFERENCES "public"."automations"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "thread" ADD CONSTRAINT "thread_parent_thread_id_thread_id_fk" FOREIGN KEY ("parent_thread_id") REFERENCES "public"."thread"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "thread_chat" ADD CONSTRAINT "thread_chat_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "thread_chat" ADD CONSTRAINT "thread_chat_thread_id_thread_id_fk" FOREIGN KEY ("thread_id") REFERENCES "public"."thread"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "thread_chat_read_status" ADD CONSTRAINT "thread_chat_read_status_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "thread_chat_read_status" ADD CONSTRAINT "thread_chat_read_status_thread_id_thread_id_fk" FOREIGN KEY ("thread_id") REFERENCES "public"."thread"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "thread_chat_read_status" ADD CONSTRAINT "thread_chat_read_status_thread_chat_id_thread_chat_id_fk" FOREIGN KEY ("thread_chat_id") REFERENCES "public"."thread_chat"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "thread_read_status" ADD CONSTRAINT "thread_read_status_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "thread_read_status" ADD CONSTRAINT "thread_read_status_thread_id_thread_id_fk" FOREIGN KEY ("thread_id") REFERENCES "public"."thread"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "thread_visibility" ADD CONSTRAINT "thread_visibility_thread_id_thread_id_fk" FOREIGN KEY ("thread_id") REFERENCES "public"."thread"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_feature_flags" ADD CONSTRAINT "user_feature_flags_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_feature_flags" ADD CONSTRAINT "user_feature_flags_feature_flag_id_feature_flags_id_fk" FOREIGN KEY ("feature_flag_id") REFERENCES "public"."feature_flags"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_flags" ADD CONSTRAINT "user_flags_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_info_server_side" ADD CONSTRAINT "user_info_server_side_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_settings" ADD CONSTRAINT "user_settings_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "agent_provider_credentials_user_id_index" ON "agent_provider_credentials" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "agent_provider_credentials_user_agent_index" ON "agent_provider_credentials" USING btree ("user_id","agent");--> statement-breakpoint
CREATE INDEX "automations_user_id_index" ON "automations" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "automations_user_id_enabled_index" ON "automations" USING btree ("user_id","enabled");--> statement-breakpoint
CREATE INDEX "automations_trigger_type_index" ON "automations" USING btree ("trigger_type");--> statement-breakpoint
CREATE INDEX "automations_pull_request_repo_full_name_index" ON "automations" USING btree ("trigger_type","repo_full_name");--> statement-breakpoint
CREATE INDEX "automations_next_run_at_index" ON "automations" USING btree ("next_run_at");--> statement-breakpoint
CREATE UNIQUE INDEX "claude_session_unique" ON "claude_session_checkpoints" USING btree ("thread_id","session_id");--> statement-breakpoint
CREATE UNIQUE INDEX "user_id_repo_full_name_branch_name_unique" ON "environment" USING btree ("user_id","repo_full_name");--> statement-breakpoint
CREATE UNIQUE INDEX "name_unique" ON "feature_flags" USING btree ("name");--> statement-breakpoint
CREATE INDEX "feedback_user_id_index" ON "feedback" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "feedback_type_index" ON "feedback" USING btree ("type");--> statement-breakpoint
CREATE INDEX "feedback_resolved_index" ON "feedback" USING btree ("resolved");--> statement-breakpoint
CREATE UNIQUE INDEX "thread_id_thread_chat_id_unique" ON "github_check_run" USING btree ("thread_id","thread_chat_id");--> statement-breakpoint
CREATE UNIQUE INDEX "repo_number_unique" ON "github_pr" USING btree ("repo_full_name","number");--> statement-breakpoint
CREATE UNIQUE INDEX "slack_account_user_team_unique" ON "slack_account" USING btree ("user_id","team_id");--> statement-breakpoint
CREATE UNIQUE INDEX "slack_account_slack_user_team_unique" ON "slack_account" USING btree ("slack_user_id","team_id");--> statement-breakpoint
CREATE INDEX "slack_installation_team_id" ON "slack_installation" USING btree ("team_id");--> statement-breakpoint
CREATE UNIQUE INDEX "slack_settings_user_team_unique" ON "slack_settings" USING btree ("user_id","team_id");--> statement-breakpoint
CREATE INDEX "user_id_index" ON "thread" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "user_id_created_at_index" ON "thread" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE INDEX "user_id_updated_at_index" ON "thread" USING btree ("user_id","updated_at");--> statement-breakpoint
CREATE INDEX "user_id_status_index" ON "thread" USING btree ("user_id","status");--> statement-breakpoint
CREATE INDEX "user_id_archived_index" ON "thread" USING btree ("user_id","archived");--> statement-breakpoint
CREATE INDEX "parent_thread_id_index" ON "thread" USING btree ("parent_thread_id");--> statement-breakpoint
CREATE INDEX "user_id_automation_id_index" ON "thread" USING btree ("user_id","automation_id");--> statement-breakpoint
CREATE INDEX "github_repo_full_name_github_pr_number_index" ON "thread" USING btree ("github_repo_full_name","github_pr_number");--> statement-breakpoint
CREATE INDEX "schedule_at_status_index" ON "thread" USING btree ("schedule_at","status");--> statement-breakpoint
CREATE INDEX "reattempt_queue_at_status_index" ON "thread" USING btree ("reattempt_queue_at","status");--> statement-breakpoint
CREATE INDEX "source_type_index" ON "thread" USING btree ("source_type");--> statement-breakpoint
CREATE INDEX "sandbox_provider_and_id_index" ON "thread" USING btree ("sandbox_provider","codesandbox_id");--> statement-breakpoint
CREATE INDEX "thread_chat_user_id_thread_id_index" ON "thread_chat" USING btree ("user_id","thread_id");--> statement-breakpoint
CREATE INDEX "user_thread_chat_thread_id_user_id_index" ON "thread_chat_read_status" USING btree ("thread_id","user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "user_thread_chat_unique" ON "thread_chat_read_status" USING btree ("user_id","thread_id","thread_chat_id");--> statement-breakpoint
CREATE UNIQUE INDEX "user_thread_unique" ON "thread_read_status" USING btree ("thread_id","user_id");--> statement-breakpoint
CREATE INDEX "thread_visibility_thread_id_index" ON "thread_visibility" USING btree ("thread_id");--> statement-breakpoint
CREATE UNIQUE INDEX "user_id_feature_flag_id_unique" ON "user_feature_flags" USING btree ("user_id","feature_flag_id");--> statement-breakpoint
CREATE UNIQUE INDEX "user_flags_user_id_unique" ON "user_flags" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "user_info_server_side_user_id_unique" ON "user_info_server_side" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "user_id_unique" ON "user_settings" USING btree ("user_id");