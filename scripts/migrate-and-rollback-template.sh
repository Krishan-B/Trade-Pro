#!/bin/bash
# Migration script template for file migration with rollback capability
# Usage: ./migrate-and-rollback-template.sh migrate|rollback <source> <destination>

set -e

ACTION=$1
SRC=$2
DEST=$3
BACKUP_DIR="/tmp/migration-backups"

mkdir -p "$BACKUP_DIR"

if [[ "$ACTION" == "migrate" ]]; then
  echo "[MIGRATION] Backing up $DEST to $BACKUP_DIR"
  if [[ -f "$DEST" ]]; then
    cp "$DEST" "$BACKUP_DIR/$(basename $DEST).bak"
  fi
  echo "[MIGRATION] Moving $SRC to $DEST"
  mv "$SRC" "$DEST"
  echo "[MIGRATION] Migration complete."
elif [[ "$ACTION" == "rollback" ]]; then
  echo "[ROLLBACK] Restoring $DEST from backup"
  if [[ -f "$BACKUP_DIR/$(basename $DEST).bak" ]]; then
    mv "$BACKUP_DIR/$(basename $DEST).bak" "$DEST"
    echo "[ROLLBACK] Rollback complete."
  else
    echo "[ROLLBACK] No backup found for $DEST. Cannot rollback."
    exit 1
  fi
else
  echo "Usage: $0 migrate|rollback <source> <destination>"
  exit 1
fi
