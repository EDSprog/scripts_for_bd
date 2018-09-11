var sqlite3 = require('sqlite3');
var faker = require('faker');
var db = new sqlite3.Database('./dbPurlu');

db.serialize(function() {
    try {
        db.run("CREATE TABLE IF NOT EXISTS place (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, phone TEXT, website TEXT, address TEXT UNIQUE, locationLat FLOAT, locationLng Float)");
        db.run("CREATE TABLE IF NOT EXISTS tag (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, category TEXT)");
        db.run("CREATE TABLE IF NOT EXISTS happy_hour (id INTEGER PRIMARY KEY AUTOINCREMENT, hourFrom INTEGER, " +
            "hourTo INTEGER, deal TEXT, repeat BOOLEAN, dayOfWeak INTEGER, placeId INTEGER,  FOREIGN KEY(placeId) REFERENCES place(id))");
        db.run("CREATE TABLE IF NOT EXISTS place_tags (id INTEGER PRIMARY KEY AUTOINCREMENT, placeId INTEGER, tagId INTEGER, FOREIGN KEY(placeId) REFERENCES place(id), FOREIGN KEY(tagId) REFERENCES tag(id))");

        var cuisineName = ['beer/cocktails', 'food', 'kids eat free'];
        var stTimeName = ['breakfast', 'lunch', 'happy hour', 'dinner', 'late night'];

        cuisineName.forEach(name => {
            var tagCuisine = {
                name: name,
                category: 'cuisine'
            };

            db.run("INSERT INTO tag (name, category) VALUES (?,?)", [tagCuisine.name, tagCuisine.category], function (err) {
                if(err) {
                    console.log('Error tag insert : '+err)
                } else {
                    console.log(`Tag ${name} inserted`)
                }
            });
        });

        stTimeName.forEach(name => {
            var tagStTime = {
                name: name,
                category: 'start time'
            };

            db.run("INSERT INTO tag (name, category) VALUES (?,?)", [tagStTime.name, tagStTime.category], function (err) {
                if(err) {
                    console.log('Error tag insert : '+err)
                } else {
                    console.log(`Tag ${name} inserted`)
                }
            });
        });

        for (var i = 1; i <= 10000; i++) {
            var newPlace = {
                name: faker.name.findName(),
                phone: faker.phone.phoneNumberFormat(),
                website: faker.internet.domainName(),
                address: faker.address.streetAddress(),
                locationLat: faker.address.latitude(),
                locationLng: faker.address.longitude()
            };

            var newHh = {
                deal: faker.hacker.phrase(),
                repeat: faker.random.boolean(),
                placeId: 0
            };

            db.run("INSERT INTO place (name, phone, website, address, locationLat, locationLng) VALUES (?,?,?,?,?,?)",
                [newPlace.name, newPlace.phone, newPlace.website, newPlace.address, newPlace.locationLat, newPlace.locationLng], function (err) {
                    if(err) {
                        console.log('Error place into : '+err)
                    } else {
                        console.log(`Place ${this.lastID} inserted`);
                    }
                });

            db.run("INSERT INTO happy_hour (hourFrom, hourTo, deal, repeat, dayOfWeak, placeId) VALUES (?,?,?,?,?,?)",
                [faker.random.number({min: 0, max: 14}), faker.random.number({min: 14, max: 24}), newHh.deal, newHh.repeat, faker.random.number({min: 1, max: 7}), i],
                function (err) {
                    if(err) {
                        console.log('Error happy_hour insert : '+err)
                    } else {
                        console.log(`happy_hour ${this.lastID} inserted, place ID = ${i}`)
                    }
                });

            for(var j = 1; j <= faker.random.number({min: 1, max: 8}); j++) {
                db.run("INSERT INTO place_tags (placeId, tagId) VALUES (?,?)", [i, faker.random.number({min: 1, max: 8})], function (err) {
                    if (err) {
                        console.log('Error place_tags insert : ' + err)
                    } else {
                        console.log(`place_tags ${this.lastID} inserted, place ID = ${i}`)
                    }
                });
            }
        }
    } catch (err) {
        console.log('Create table error : '+err)
    }
});

db.close();