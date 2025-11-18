import mysql.connector as sql

# Establish connection to the MySQL database
conn = sql.connect(host='localhost',
                   user='root', password='your_password',
                   database='ATM_MACH', auth_plugin='mysql_native_password') #you need to create database btw(text me if you want mine)
crsr = conn.cursor()

# Main menu
print('=============================')
print('Welcome to ATM')
print('=============================')
print('1.To create account')
print('2. To login')
print('3. To exit')
print('=============================')

ch1 = int(input("Enter your choice (1/2/3): "))
print('=============================')

# Option 1: Create a new account
if ch1 == 1:
    x = 'y'
    while x == 'y':
        accno1 = int(input('Enter a 4 digit number as account number: '))
        com1 = 'select*from data where ACC_NO={}'.format(accno1)
        crsr.execute(com1)
        z1 = crsr.fetchall()
        z2 = crsr.rowcount
        
        # Check if account number already exists
        if z2 == 1:
            print('This account number already exists')
            ch2 = input('Do you want to continue(y/n)? ')
            print('===================================')
            if ch2 == 'y':
                continue
            else:
                print('Thank you, visit again')
                print('=============================')
                break
        else:
            name1 = input('Enter your name: ')
            pass1 = input('Enter your password: ')
            # Insert new account details into the database
            com2 = 'insert into data(ACC_NO, NAME, PASSWORD) values({},"{}","{}")'.format(accno1, name1, pass1)
            crsr.execute(com2)
            conn.commit()
            print('Account created successfully')
            print('================================')
            print('The minimum balance is 1000')
            print('================================')
            ball = int(input('Enter the money to be deposited: '))
            print('================================')
            # Update the balance for the new account
            com3 = 'update data set BANK_BAL ={} where ACC_NO={}'.format(ball, accno1)
            crsr.execute(com3)
            conn.commit()
            print('Money deposited successfully')
            print('Thank you, visit again')
            print('=============================')
            break

# Option 2: Login to an existing account
elif ch1 == 2:
    y = 'y'
    while y == 'y':
        accno2 = int(input('Enter your account number: '))
        com4 = 'select*from data where ACC_NO={}'.format(accno2)
        crsr.execute(com4)
        crsr.fetchall()
        z3 = crsr.rowcount
        
        # Check if account exists
        if z3 == 1:
            pass2 = input('Enter your password: ')
            print('======================================')
            com5 = 'select PASSWORD from data where ACC_NO={}'.format(accno2)
            crsr.execute(com5)
            z4 = crsr.fetchone()
            z5 = list(z4)
            
            # Verify password
            if pass2 == z5[0]:
                print('Correct password')
                print('=============================')
                print('1.Deposit money')
                print('2.Withdraw money')
                print('3.Transfer money')
                print('4.Check balance')
                print('5.Change password')
                print('=============================')
                ch3 = int(input('Enter your choice (1/2/3/4/5): '))
                print('=============================')

                # Deposit Money
                if ch3 == 1:
                    bal2 = int(input('Enter the money to deposit: '))
                    print('===========================================')
                    com6 = 'update data set BANK_BAL=BANK_BAL+{} where ACC_NO={}'.format(bal2, accno2)
                    crsr.execute(com6)
                    conn.commit()
                    print('Money deposited successfully')
                    ch4 = input('Do you want to continue(y/n)? ')
                    print('=============================')
                    if ch4 == 'y':
                        continue
                    else:
                        print('Thank you, visit again')
                        print('=============================')
                        break

                # Withdraw Money
                elif ch3 == 2:
                    bal3 = int(input('Enter the money to withdraw: '))
                    print('=============================================')
                    com7 = 'select BANK_BAL from data where ACC_NO = {}'.format(accno2)
                    crsr.execute(com7)
                    z6 = crsr.fetchone()
                    if bal3 > z6[0]:
                        print('Your account does not have sufficient money to withdraw')
                        print('Please try again')
                        print('===========================================')
                    else:
                        com8 = 'update data set BANK_BAL=BANK_BAL-{} where ACC_NO={}'.format(bal3, accno2)
                        crsr.execute(com8)
                        conn.commit()
                        print('Money withdrawn successfully')
                        print('========================================')
                        ch5 = input('Do you want to continue(y/n)? ')
                        if ch5 == 'y':
                            continue
                        else:
                            print('Thank you, visit again')
                            print('=============================')
                            break
                
                # Transfer Money
                elif ch3 == 3:
                    accnot = int(input('Enter the account to which you want to transfer money: '))
                    print('=============================')
                    com9 = 'select*from data where ACC_NO = {}'.format(accnot)
                    crsr.execute(com9)
                    crsr.fetchall()
                    z7 = crsr.rowcount
                    if z7 == 1:
                        print('Account number exists')
                        balt = int(input('Enter the money to be transferred: '))
                        print('=============================')
                        com10 = 'select BANK_BAL from data where ACC_NO={}'.format(accnot)
                        crsr.execute(com10)
                        z8 = crsr.fetchone()
                        if balt > z8[0]:
                            print('Your account does not have sufficient money to transfer')
                            print('Please try again')
                            print('======================================')
                        else:
                            com11 = 'update data set BANK_BAL=BANK_BAL-{} where ACC_NO={}'.format(balt, accno2)
                            com12 = 'update data set BANK_BAL=BANK_BAL+{} where ACC_NO={}'.format(balt, accnot)
                            crsr.execute(com11)
                            crsr.execute(com12)
                            conn.commit()
                            print('Money transferred successfully')
                            print('=============================')
                            ch6 = input('Do you want to continue(y/n)? ')
                            print('=============================')
                            if ch6 == 'y':
                                continue
                            else:
                                print('Thank you, visit again')
                                break
                    else:
                        print('Account does not exists')
                        print('Please try again')
                        print('=============================')

                # Check Balance
                elif ch3 == 4:
                    com13 = 'select BANK_BAL from data where ACC_NO = {}'.format(accno2)
                    crsr.execute(com13)
                    z9 = crsr.fetchone()
                    print('Balance in your account:', z9)
                    print('=======================================')
                    ch7 = input('Do you want to continue(y/n)? ')
                    if ch7 == 'y':
                        continue
                    else:
                        print('Thank you, visit again')
                        print('=============================')
                        break

                # Change Password
                elif ch3 == 5:
                    pass3 = input("Enter your new password: ")
                    com14 = 'update data set PASSWORD="{}" where ACC_NO={}'.format(pass3, accno2)
                    crsr.execute(com14)
                    conn.commit()
                    print('Password changed successfully')
                    print('=============================')
                    break
            else:
                print('Wrong password')
                print('Please try again')
                print('=============================')
        else:
            print('Your account does not exists')
            print('Please try again')
            print('================================')

# Option 3: Exit the program
elif ch1 == 3:
    print('Exiting')

# Close the database connection
crsr.close()