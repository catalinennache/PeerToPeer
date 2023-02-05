## How to run it
*Requires node version >= 14

1.Run make.bat
2.Start the 2 cli apps with the commands
  *npm start --port=xxxx -peerPort=yyyy
  *npm start --port=yyyy -peerPort=xxxx

## Description
A "peering relationship" is a way to keep track of debt between two parties. The peering
relationship balance starts at 0 and both parties independently track their views of the
balance. If User A owes User B $10, then User A sees a balance of -10 and User B sees a balance of
10. If User A sends User B $10 more, then User A's balance would be -20, and User B’s balance would be 20.

This program implements a peering relationship and exposes an interactive Command
Line Interface. Once both users start the interactive prompt, they should be able to send
money to the other user and view their own balance.

## Constraints
• Each user keeps track of their own balance
• Assume the users are on different computers
• State does not have to persist between sessions
• State should not be tracked or stored remotely (i.e. on a server)

### Example Terminal Output
User A
$ ./start-peer ... # (plus connection options)
Welcome to your peering relationship!
> balance
0
> pay 10
Sent
> balance
-10 # (other balance is now 10)
> exit
Goodbye.

User B
$ ./start-peer ... # (plus connection options)
Welcome to your peering relationship!
> balance
0
You were paid 10!
> balance
10
> exit
Goodbye.
