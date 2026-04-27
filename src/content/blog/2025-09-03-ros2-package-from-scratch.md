---
title: Changing Folder Name for model training
date: '2020-10-03'
summary: Quick hack to change dataset name for model training
tags:
  - python
  - filename
  - datascience
  - dog-breed
draft: false
---

# What are we doing in this blog? 

We are changing folders name like this:

- Folder Name from `n02113023-Pembroke` Changed to `Pembroke`
- Folder Name from `n02113624-toy_poodle` Changed to `Toy Poodle`
- Folder Name from `n02115641-dingo` Changed to `Dingo`

If want to learn this, Go on with reading:

In this, dataset directory. I have downloaded, famous standford [dataset](http://vision.stanford.edu/aditya86/ImageNetDogs/). The Stanford Dogs dataset contains images of 120 breeds of dogs from around the world. This dataset has been built using images and annotation from ImageNet for the task of fine-grained image categorization. 


The name of the folders (which will be used as classes while training) have names like, `n02093256-Staffordshire_bullterrier`. We definitely don't want our class to be like that but rather simple `Staffordshire Bullterrier`. The python script will get rid of any weird characters that are unneccessary.

Now, we have our path defined where the data is situated. In my case, i had uploaded it to google drive. Time consuming upload, avoid it if possible.

Let's say we have folder name like this:

`n02093256-Staffordshire_bullterrier`

Here is our process of obtaining what we want,
-   We first split on the basis of  - (hyphen) charachter
- Then we obtain list like this: `['n02093256' , 'Staffordshire_bullterrier']`
- After that, we use slicing technique to select second index.
- Then after we have what we wanted, we can simply again split on the basis of  _ (underscore)
- Then we obtain something like this:
`['Staffordshire','bullterrier']`
- After we have what we wanted we can simply join the list back. And use capitalize to make first letter of word capitalize.

> 📝 Note: This code will need to be modified according to the folder name you are dealing with.

```
'''
THIS PYTHON CODE CHANGES NAME OF FILES IN A FOLDER
'''

import os
import string


def change_name(folder_name): 
    folder_name=folder_name.split('-') #n02113023-Pembroke->['n02113023','Pembroke'] 
    folder_name= ' '.join(folder_name[1:]) #Selecting index after 1 and joining them
    folder_name=folder_name.split('_') # Again splitting becayse name seem to be like Staffordshire_bullterrier
    folder_name= ' '.join(folder_name) #again joining after getting rid of _ 
    return string.capwords(folder_name) #or we can use capitalize()

#iterating over all the folders and changing file name
for fn in os.listdir(path):

    new_path= os.path.join(path,fn)
    #folder_name= os.path.basename(new_path) #alternative use of to know file name    
    new_folder_name= change_name(fn)
    os.rename(os.path.join(path,fn),os.path.join(path,new_folder_name))
    print (f'Folder Name from {fn} Changed to {new_folder_name}')
```
```
Output :
Folder Name from n02113023-Pembroke Changed to Pembroke
Folder Name from n02093256-Staffordshire_bullterrier Changed to Staffordshire Bullterrier
Folder Name from n02093428-American_Staffordshire_terrier Changed to American Staffordshire Terrier
Folder Name from n02113624-toy_poodle Changed to Toy Poodle
Folder Name from n02100236-German_short-haired_pointer Changed to German Short Haired Pointer
Folder Name from n02115641-dingo Changed to Dingo
Folder Name from n02089867-Walker_hound Changed to Walker Hound
Folder Name from n02099601-golden_retriever Changed to Golden Retriever
Folder Name from n02105162-malinois Changed to Malinois
Folder Name from n02100735-English_setter Changed to English Setter
Folder Name from n02097298-Scotch_terrier Changed to Scotch Terrier
Folder Name from n02095889-Sealyham_terrier Changed to Sealyham Terrier
Folder Name from n02106550-Rottweiler Changed to Rottweiler
Folder Name from n02088094-Afghan_hound Changed to Afghan Hound
Folder Name from n02112018-Pomeranian Changed to Pomeranian
Folder Name from n02099429-curly-coated_retriever Changed to Curly Coated Retriever
Folder Name from n02095314-wire-haired_fox_terrier Changed to Wire Haired Fox Terrier
Folder Name from n02116738-African_hunting_dog Changed to African Hunting Dog
Folder Name from n02091467-Norwegian_elkhound Changed to Norwegian Elkhound
Folder Name from n02096294-Australian_terrier Changed to Australian Terrier
Folder Name from n02108422-bull_mastiff Changed to Bull Mastiff
Folder Name from n02096177-cairn Changed to Cairn
Folder Name from n02104365-schipperke Changed to Schipperke
Folder Name from n02101556-clumber Changed to Clumber
Folder Name from n02090721-Irish_wolfhound Changed to Irish Wolfhound
Folder Name from n02110806-basenji Changed to Basenji
Folder Name from n02105251-briard Changed to Briard
Folder Name from n02102040-English_springer Changed to English Springer
Folder Name from n02085620-Chihuahua Changed to Chihuahua
Folder Name from n02110063-malamute Changed to Malamute
Folder Name from n02109525-Saint_Bernard Changed to Saint Bernard
Folder Name from n02107683-Bernese_mountain_dog Changed to Bernese Mountain Dog
Folder Name from n02111129-Leonberg Changed to Leonberg
Folder Name from n02094114-Norfolk_terrier Changed to Norfolk Terrier
Folder Name from n02110627-affenpinscher Changed to Affenpinscher
Folder Name from n02111277-Newfoundland Changed to Newfoundland
Folder Name from n02112350-keeshond Changed to Keeshond
Folder Name from n02106382-Bouvier_des_Flandres Changed to Bouvier Des Flandres
Folder Name from n02093647-Bedlington_terrier Changed to Bedlington Terrier
Folder Name from n02107312-miniature_pinscher Changed to Miniature Pinscher
Folder Name from n02115913-dhole Changed to Dhole
Folder Name from n02111889-Samoyed Changed to Samoyed
Folder Name from n02091032-Italian_greyhound Changed to Italian Greyhound
Folder Name from n02085782-Japanese_spaniel Changed to Japanese Spaniel
Folder Name from n02098286-West_Highland_white_terrier Changed to West Highland White Terrier
Folder Name from n02090379-redbone Changed to Redbone
Folder Name from n02099849-Chesapeake_Bay_retriever Changed to Chesapeake Bay Retriever
Folder Name from n02106662-German_shepherd Changed to German Shepherd
Folder Name from n02105505-komondor Changed to Komondor
Folder Name from n02087046-toy_terrier Changed to Toy Terrier
Folder Name from n02098105-soft-coated_wheaten_terrier Changed to Soft Coated Wheaten Terrier
Folder Name from n02099267-flat-coated_retriever Changed to Flat Coated Retriever
Folder Name from n02104029-kuvasz Changed to Kuvasz
Folder Name from n02096585-Boston_bull Changed to Boston Bull
Folder Name from n02097130-giant_schnauzer Changed to Giant Schnauzer
Folder Name from n02086646-Blenheim_spaniel Changed to Blenheim Spaniel
Folder Name from n02112706-Brabancon_griffon Changed to Brabancon Griffon
Folder Name from n02111500-Great_Pyrenees Changed to Great Pyrenees
Folder Name from n02088466-bloodhound Changed to Bloodhound
Folder Name from n02101006-Gordon_setter Changed to Gordon Setter
Folder Name from n02108089-boxer Changed to Boxer
Folder Name from n02113799-standard_poodle Changed to Standard Poodle
Folder Name from n02086910-papillon Changed to Papillon
Folder Name from n02113712-miniature_poodle Changed to Miniature Poodle
Folder Name from n02095570-Lakeland_terrier Changed to Lakeland Terrier
Folder Name from n02098413-Lhasa Changed to Lhasa
Folder Name from n02106030-collie Changed to Collie
Folder Name from n02092002-Scottish_deerhound Changed to Scottish Deerhound
Folder Name from n02110185-Siberian_husky Changed to Siberian Husky
Folder Name from n02088238-basset Changed to Basset
Folder Name from n02097047-miniature_schnauzer Changed to Miniature Schnauzer
Folder Name from n02108551-Tibetan_mastiff Changed to Tibetan Mastiff
Folder Name from n02105412-kelpie Changed to Kelpie
Folder Name from n02106166-Border_collie Changed to Border Collie
Folder Name from n02102480-Sussex_spaniel Changed to Sussex Spaniel
Folder Name from n02110958-pug Changed to Pug
Folder Name from n02109961-Eskimo_dog Changed to Eskimo Dog
Folder Name from n02096437-Dandie_Dinmont Changed to Dandie Dinmont
Folder Name from n02091831-Saluki Changed to Saluki
Folder Name from n02105056-groenendael Changed to Groenendael
Folder Name from n02113186-Cardigan Changed to Cardigan
Folder Name from n02102973-Irish_water_spaniel Changed to Irish Water Spaniel
Folder Name from n02113978-Mexican_hairless Changed to Mexican Hairless
Folder Name from n02092339-Weimaraner Changed to Weimaraner
Folder Name from n02105855-Shetland_sheepdog Changed to Shetland Sheepdog
Folder Name from n02089973-English_foxhound Changed to English Foxhound
Folder Name from n02102318-cocker_spaniel Changed to Cocker Spaniel
Folder Name from n02097658-silky_terrier Changed to Silky Terrier
Folder Name from n02088632-bluetick Changed to Bluetick
Folder Name from n02091635-otterhound Changed to Otterhound
Folder Name from n02108000-EntleBucher Changed to Entlebucher
Folder Name from n02094258-Norwich_terrier Changed to Norwich Terrier
Folder Name from n02112137-chow Changed to Chow
Folder Name from n02094433-Yorkshire_terrier Changed to Yorkshire Terrier
Folder Name from n02097474-Tibetan_terrier Changed to Tibetan Terrier
Folder Name from n02100583-vizsla Changed to Vizsla
Folder Name from n02097209-standard_schnauzer Changed to Standard Schnauzer
Folder Name from n02096051-Airedale Changed to Airedale
Folder Name from n02091134-whippet Changed to Whippet
Folder Name from n02107908-Appenzeller Changed to Appenzeller
Folder Name from n02105641-Old_English_sheepdog Changed to Old English Sheepdog
Folder Name from n02085936-Maltese_dog Changed to Maltese Dog
Folder Name from n02087394-Rhodesian_ridgeback Changed to Rhodesian Ridgeback
Folder Name from n02108915-French_bulldog Changed to French Bulldog
Folder Name from n02100877-Irish_setter Changed to Irish Setter
Folder Name from n02109047-Great_Dane Changed to Great Dane
Folder Name from n02107574-Greater_Swiss_Mountain_dog Changed to Greater Swiss Mountain Dog
Folder Name from n02086240-Shih-Tzu Changed to Shih Tzu
Folder Name from n02093859-Kerry_blue_terrier Changed to Kerry Blue Terrier
Folder Name from n02086079-Pekinese Changed to Pekinese
Folder Name from n02107142-Doberman Changed to Doberman
Folder Name from n02088364-beagle Changed to Beagle
Folder Name from n02101388-Brittany_spaniel Changed to Brittany Spaniel
Folder Name from n02093754-Border_terrier Changed to Border Terrier
Folder Name from n02089078-black-and-tan_coonhound Changed to Black And Tan Coonhound
Folder Name from n02099712-Labrador_retriever Changed to Labrador Retriever
Folder Name from n02093991-Irish_terrier Changed to Irish Terrier
Folder Name from n02090622-borzoi Changed to Borzoi
Folder Name from n02091244-Ibizan_hound Changed to Ibizan Hound
Folder Name from n02102177-Welsh_springer_spaniel Changed to Welsh Springer Spaniel
```

Hopefully, this post was helpful in some way !





