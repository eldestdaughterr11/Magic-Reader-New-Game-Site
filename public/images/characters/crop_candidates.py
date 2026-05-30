from PIL import Image

img = Image.open(r"C:\Users\tipid\.gemini\antigravity\brain\e3a14a04-1099-4b5b-8d6b-63dfaa24c2d9\media__1780156788803.png")

# Let's crop U challenge
# Let's look at y from 490 to 630 (approx 140px tall)
# Let's try x from 10 to 190 (width 180)
u_crop = img.crop((10, 520, 190, 660))
u_crop.save("public/images/characters/temp_u_challenge_candidate.png")

# Let's crop Vowel Stones
# Let's look at y from 620 to 760 (approx 140px tall)
# Let's try x from 10 to 230 (width 220)
stones_crop = img.crop((10, 630, 230, 850))
stones_crop.save("public/images/characters/temp_stones_candidate.png")

print("Saved candidate crops!")
