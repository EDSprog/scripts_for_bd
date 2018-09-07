var sqlite3 = require('sqlite3');
var faker = require('faker');
var db = new sqlite3.Database('./dbPurlu');

db.serialize(function() {
    try {
        db.run("CREATE TABLE IF NOT EXISTS place (id INTEGER AUTO_INCREMENT UNIQUE PRIMARY KEY, name TEXT, phone TEXT, website TEXT, address TEXT UNIQUE, locationLat FLOAT, locationLng Float)");
        db.run("CREATE TABLE IF NOT EXISTS tag (id INTEGER AUTO_INCREMENT UNIQUE PRIMARY KEY, name TEXT, category TEXT)");
        db.run("CREATE TABLE IF NOT EXISTS happy_hour (id INTEGER AUTO_INCREMENT UNIQUE PRIMARY KEY, hourFrom INTEGER, " +
            "hourTo INTEGER, deal TEXT, repeat BOOLEAN, dayOfWeak INTEGER, placeId INTEGER,  FOREIGN KEY(placeId) REFERENCES place(id))");
        db.run("CREATE TABLE IF NOT EXISTS place_tags (id INTEGER PRIMARY KEY AUTOINCREMENT, placeId INTEGER, tagId INTEGER, FOREIGN KEY(placeId) REFERENCES place(id), FOREIGN KEY(tagId) REFERENCES tag(id))");

        for (var i = 0; i < 10000; i++) {
            var newPlace = {
                name: faker.name.findName(),
                phone: faker.phone.phoneNumberFormat(),
                website: faker.internet.domainName(),
                address: faker.address.streetAddress(),
                locationLat: faker.random.number({min: 100000, max: 999999}),
                locationLng: faker.random.number({min: 100000, max: 999999})
            };

            var newTag = {
                name: faker.name.findName(),
                category: faker.random.arrayElement(['cuisine, startTime'])
            }

            db.run("INSERT INTO place (name, phone, website, address, locationLat, locationLng) VALUES (?,?,?,?,?,?)",
                [newPlace.name, newPlace.phone, newPlace.website, newPlace.address, newPlace.locationLat, newPlace.locationLng], function (err) {
                    if(err) {
                        console.log('Error place into : '+err)
                    } else {
                        console.log(`Place ${i} inserted`)
                    }
                });

            db.run("INSERT INTO tag (name, category) VALUES (?,?)", [newTag.name, newTag.category], function (err) {
                if(err) {
                    console.log('Error tag insert : '+err)
                } else {
                    console.log(`Tag ${i} inserted`)
                }
            });

            db.run("INSERT INTO tag (name, category) VALUES (?,?)", [newTag.name, newTag.category], function (err) {
                if(err) {
                    console.log('Error tag insert : '+err)
                } else {
                    console.log(`Tag ${i} inserted`)
                }
            });
        }
    } catch (err) {
        console.log('Create table error : '+err)
    }
});

db.close();