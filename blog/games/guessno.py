import random
number = random.randint(1, 100)
guess = int(input("Guess a number between 1 and 100: "))
while guess != number:
    if guess < number:
        print("Too low!")
    else:
        print("Too high!")
    guess = int(input("Guess again: "))
print("You got it!")