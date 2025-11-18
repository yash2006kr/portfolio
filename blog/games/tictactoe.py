# me building Tic Tac Toe game
print('''Tic Tac Toe Game
''')
print("Remember the positions")
print(' -- -- --')
print('| 1| 2| 3|')
print(' -- -- --')
print('| 4| 5| 6|')
print(' -- -- --')
print('| 7| 8| 9|')
print(' -- -- --')

board = [" "] * 9

p1 = input("Who will play for 'X': ")
p2 = input("Who will play for 'O' : ")

def print_board():
    print(' -- -- --')
    print(f'| {board[0]}| {board[1]}| {board[2]}|')
    print(' -- -- --')
    print(f'| {board[3]}| {board[4]}| {board[5]}|')
    print(' -- -- --')
    print(f'| {board[6]}| {board[7]}| {board[8]}|')
    print(' -- -- --')

def check_win(mark):
    win_combos = [
        [0,1,2], [3,4,5], [6,7,8], # rows
        [0,3,6], [1,4,7], [2,5,8], # cols
        [0,4,8], [2,4,6]           # diags
    ]
    for combo in win_combos:
        if all(board[i] == mark for i in combo):
            return True
    return False

print("\nLet's Gooo....\n")
current_player = 'X'
players = {'X': p1, 'O': p2}
for turn in range(9):
    player = players[current_player]
    while True:
        try:
            pos = int(input(f"{player} Enter the position (1-9): "))
            if pos < 1 or pos > 9:
                print("Max position is 9 bruh!")
                continue
            if board[pos-1] != " ":
                print("Position is already entered")
                continue
            board[pos-1] = current_player
            break
        except ValueError:
            print("Enter a valid number!")
    print_board()
    if check_win(current_player):
        print(f"{player} won the game, better luck next time {players['O' if current_player == 'X' else 'X']}")
        break
    current_player = 'O' if current_player == 'X' else 'X'
else:
    print("It's a draw!")
