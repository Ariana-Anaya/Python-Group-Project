from app.models import db, Review, environment, SCHEMA
from sqlalchemy.sql import text
from datetime import datetime


def seed_reviews():
    review1 = Review(
        user_id=1,
        business_id=1,
        rating=5,
        content="This is my favorite cafe, the interior is super welcoming and great if you want to hang out and work. Some of the signature drinks are a little on the pricier side but their regular drinks are pretty affordable, they also offer discounted refills on signature drinks and free refills on plain coffee. Wifi is pretty fast and the seating is comfortable. I love their espresso.",
        created_at=datetime.now(),
        updated_at=datetime.now()
    )
    review2 = Review(
        user_id=2,
        business_id=1,
        rating=4,
        content="Pretty cute  cafe, popped in because I was running errands near by and I enjoyed the drink. I thought the iced coffee cubes were a super cool touch. It has a large section for studying and getting some work done. I took my coffee to go so I didn’t experience it long but it seemed like a great place to hang out. The only reason I don’t give it 5 stars is because of the prices being a little high",
        created_at=datetime.now(),
        updated_at=datetime.now()
    )
    review3 = Review(
        user_id=3,
        business_id=1,
        rating=3,
        content="Cool cafe and environment I suppose, coffee is way to sweet for my taste, I like a little more coffee with my milk",
        created_at=datetime.now(),
        updated_at=datetime.now()
    )
    review4 = Review(
        user_id=1,
        business_id=2,
        rating=3,
        content="This might be one of the most overrated places I’ve visited. Granted prices are good, but I’d rather pay more for something I will actually enjoy.  Service and hospitality is great but that only gets you so far. Might give it another chance.",
        created_at=datetime.now(),
        updated_at=datetime.now()
    )
    review5 = Review(
        user_id=2,
        business_id=2,
        rating=4,
        content="Greasy, messy, pepperoni loaded pizza … I love it. Its definitely not the most amazing pizza but it honestly hits the spot for me",
        created_at=datetime.now(),
        updated_at=datetime.now()
    )
    review6 = Review(
        user_id=3,
        business_id=2,
        rating=2,
        content="Bro this is the most mid pizza ever",
        created_at=datetime.now(),
        updated_at=datetime.now()
    )
    review7 = Review(
        user_id=1,
        business_id=3,
        rating=1,
        content="I don’t typically leave review but my experience was so bad I had to. Firstly the food was awful. I had to send back my dish because It was undercooked .. on top of that they forgot to remove the onions from my wife’s dish… my kids felt sick after eating here… stay away!!",
        created_at=datetime.now(),
        updated_at=datetime.now()
    )
    review8 = Review(
        user_id=2,
        business_id=3,
        rating=3,
        content="Small diner, no bells and whistles but what else would you expect from a hole in the wall diner. I like their breakfast, dinner options are ok, My friends and I like coming here after a concert for some late night pancakes",
        created_at=datetime.now(),
        updated_at=datetime.now()
    )
    review9 = Review(
        user_id=1,
        business_id=4,
        rating=2,
        content="I don’t think I’d revisit this location, maybe I went on a bad day but service was super slow and unwelcoming. I found their burgers to be just ok, fries were bland. Their other locations are a bit better but still nothing I would recommend.",
        created_at=datetime.now(),
        updated_at=datetime.now()
    )
    review10 = Review(
        user_id=2,
        business_id=4,
        rating=3,
        content="Just an average burger place…  Their chili cheese fries are fire tho",
        created_at=datetime.now(),
        updated_at=datetime.now()
    )
    review11 = Review(
        user_id=1,
        business_id=5,
        rating=4,
        content="Solid taco spot. Pretty straightforward. They have your typical selection of tacos, burritos and other staples. Their hidden gem is the menudo, great for the morning after a fun night. Service is standard. I do like the music they play though…",
        created_at=datetime.now(),
        updated_at=datetime.now()
    )
    review12 = Review(
        user_id=2,
        business_id=5,
        rating=5,
        content="My family and I have been coming here for years, its been in our community for ages, the owners are super cool and prices are great",
        created_at=datetime.now(),
        updated_at=datetime.now()
    )
    review13 = Review(
        user_id=1,
        business_id=6,
        rating=4,
        content="Great restaurant. Decent prices, service was a bit lackluster but good experience overall.",
        created_at=datetime.now(),
        updated_at=datetime.now()
    )
    review14 = Review(
        user_id=2,
        business_id=6,
        rating=5,
        content="Was visiting and found this place online.. they have a good selection of seafood. I got the snow crab and although it’s pricey (thanks market price) it was amazing… the garlic butter sauce they give you is borderline drinkable 10/10",
        created_at=datetime.now(),
        updated_at=datetime.now()
    )
    review15 = Review(
        user_id=1,
        business_id=7,
        rating=5,
        content="I’d consider myself a pizza snob so when I see a place that advertises itself as best pizza in town I had to see for myself. It definitely is in the conversation and a must try, I’m a traditional pizza person so I went with their signature and I loved it. The garlic knots were also great. Reasonable prices as well. The owners seem very hands on and personable and it makes you really want to go back again, definitely  recommend.",
        created_at=datetime.now(),
        updated_at=datetime.now()
    )
    review16 = Review(
        user_id=2,
        business_id=7,
        rating=5,
        content="If you can only go to one pizza spot in the area make it this one… expect a crazy wait time on weekends and evenings or order ahead (pro tip - park by the bank across the street)",
        created_at=datetime.now(),
        updated_at=datetime.now()
    )
    review17 = Review(
        user_id=3,
        business_id=7,
        rating=2,
        content="How do you run out of pepperoni?!?!",
        created_at=datetime.now(),
        updated_at=datetime.now()
    )
    review18 = Review(
        user_id=1,
        business_id=8,
        rating=5,
        content="I love this place, I come at least once a month. Prices are great for what you’re getting and the Arrabiata pasta is excellent. My only drawback is parking, you’ll likely spin the block a few times during rush hour but it’s worth it.",
        created_at=datetime.now(),
        updated_at=datetime.now()
    )
    review19 = Review(
        user_id=2,
        business_id=8,
        rating=2,
        content="I love pasta… I did not love North Beach Pasta. Way overcooked and gooey and overpriced I don’t get the hype . Ive had better pasta sauce from a jar",
        created_at=datetime.now(),
        updated_at=datetime.now()
    )
    review20 = Review(
        user_id=1,
        business_id=9,
        rating=4,
        content="I was craving sushi and found this was near me so the family and I checked It out. I enjoyed the apps and food, drinks are a bit pricey. I feel like portions are a bit small for the prices. Overall a solid choice if you like sushi.",
        created_at=datetime.now(),
        updated_at=datetime.now()
    )
    review21 = Review(
        user_id=2,
        business_id=9,
        rating=5,
        content="Fresh sushi? Check. Authentic? Check.  Ambiance? Check. Service? Check. Prices? Meh but its ok cause everything else is fantastic",
        created_at=datetime.now(),
        updated_at=datetime.now()
    )
    review22 = Review(
        user_id=3,
        business_id=9,
        rating=4,
        content="This place is great for groups or date night, the low ambient light and decor is so cute. The rolls and sashimi are amazing. I really like that you can see the chefs as they prepare the food",
        created_at=datetime.now(),
        updated_at=datetime.now()
    )
    review23 = Review(
        user_id=1,
        business_id=10,
        rating=4,
        content="If you’re looking for a late night meal this is the place to go. My favorite are the lengua tacos and don’t skip their aquas frescas. The  prices are definitely on the higher side for tacos but the presentation and taste is great. Crowds are unpredictable so be prepared for no line at all or a long wait.",
        created_at=datetime.now(),
        updated_at=datetime.now()
    )
    review24 = Review(
        user_id=2,
        business_id=10,
        rating=5,
        content="This place rivals tacos el gordo, if you’re in the area definitely stop by. The fresh made tortillas are delicious and the meat is super tender … plus the salsa verde and the guac? It slaps",
        created_at=datetime.now(),
        updated_at=datetime.now()
    )

    db.session.add_all([
        review1, review2, review3, review4, review5, review6,
        review7, review8, review9, review10, review11, review12,
        review13, review14, review15, review16, review17, review18,
        review19, review20, review21, review22, review23, review24
    ])
    db.session.commit()

def undo_reviews():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.reviews RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM reviews"))

    db.session.commit()