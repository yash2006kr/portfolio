print("FLAMES")
u1 = input("Enter 1st person name: ").upper()
u2 = input("Enter 2nd person name: ").upper()

u1_list = list(u1)
u2_list = list(u2)

for char in u1_list[:]:
    if char in u2_list:
        u1_list.remove(char)
        u2_list.remove(char)

a = len(u1_list) + len(u2_list)

# Reduce to 1-6
a = a % 6
if a == 0:
    print("Annaa Nam Hathrane")
if a == 1:
    print("Chill They Both are Just Friends")
elif a == 2:
    print("On God They are Lovers")
elif a == 3:
    print("Aiii Affection Aiii")
elif a == 4:
    print("Mangalyam Thanthunamena")
elif a == 5:
    print("They are Enemies")
elif a == 6:
    print("Siblings ahh?")
else:
    print("Bhai kuch hogayi")
