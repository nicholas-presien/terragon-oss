#!/bin/bash

set -e

echo "============================================"
echo "Claude Code API Setup"
echo "============================================"
echo ""

# Ask for API key
echo "Please enter your Anthropic API key:"
read -r API_KEY

if [ -z "$API_KEY" ]; then
    echo "Error: API key cannot be empty"
    exit 1
fi

# Create .claude directory if it doesn't exist
CLAUDE_DIR="$HOME/.claude"
echo "Creating $CLAUDE_DIR directory..."
mkdir -p "$CLAUDE_DIR"

# Create/update settings.json
SETTINGS_FILE="$CLAUDE_DIR/settings.json"
echo "Creating/updating $SETTINGS_FILE..."
cat > "$SETTINGS_FILE" << 'EOF'
{
  "apiKeyHelper": "~/.claude/anthropic_key.sh"
}
EOF

# Create anthropic_key.sh with the API key
KEY_SCRIPT="$CLAUDE_DIR/anthropic_key.sh"
echo "Creating $KEY_SCRIPT..."
cat > "$KEY_SCRIPT" << EOF
#!/bin/bash
echo "$API_KEY"
EOF

# Make the script executable
echo "Making $KEY_SCRIPT executable..."
chmod +x "$KEY_SCRIPT"

echo ""
echo "============================================"
echo "Setup Complete!"
echo "============================================"
echo ""
echo "Configuration files created:"
echo "  - $SETTINGS_FILE"
echo "  - $KEY_SCRIPT"
echo ""
echo "Your API key has been securely stored."
echo ""
