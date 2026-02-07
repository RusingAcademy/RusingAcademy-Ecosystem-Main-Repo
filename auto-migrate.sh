#!/bin/bash
# Auto-accept all "create column" prompts in drizzle-kit generate
cd /home/ubuntu/ecosystemhub-preview

# Use expect to auto-press Enter for all prompts
expect -c '
set timeout 120
spawn npx drizzle-kit generate
while {1} {
  expect {
    "create column" {
      send "\r"
    }
    "create table" {
      send "\r"
    }
    "create index" {
      send "\r"
    }
    eof {
      break
    }
    timeout {
      break
    }
  }
}
wait
'
