var User        = require('../models/user');
var Category    = require('../models/categories');
var Department  = require('../models/department');
var Product     = require('../models/product');
var Variant     = require('../models/variant');
var mongoose    = require('mongoose');
//mongoose.connect('mongodb://localhost/shoppingApp');
//mongoose.connect('mongodb://localhost/myShoppingApp3', { useNewUrlParser: true, useCreateIndex: true, });
mongoose.connect('mongodb://localhost/myShoppingApp3');


var categories =
[
    new Category({
        categoryName        : 'Trainers'
    }),
]

for (let i = 0; i < categories.length; i++){
    categories[i].save(function(e, r) {
        if (i === categories.length - 1){
            exit();
        }
    });
}

var departments =
[
    new Department({
        departmentName      : 'Women',
        categories          : 'Trainers'

    }),
    new Department({
        departmentName      : 'Men',
        categories          : 'Trainers'
    })
]

for (let i = 0; i < departments.length; i++){
    departments[i].save(function(e, r) {
        if (i === departments.length - 1){
            exit();
        }
    });
}

var products =
[
    new Product({
        _id: "5bedf31cc14d7822b39d9d43",
        imagePath: 'http://images.asos-media.com/products/adidas-originals-gold-metallic-falcon-trainers/10520020-3?$XXL$&wid=513&fit=constrain',
        title: 'adidas Originals Falcon trainers',
        description: 'Breathable textile upper, so they stay fresher for longer',
        price: 178.84,
        color: 'Gold',
        size: '9,10,11',
        quantity: 10,
        department: 'Women',
        category: 'Trainers',
    }),
    new Product({
        _id: "5bedf3b9c14d7822b39d9d45",
        imagePath: 'http://images.asos-media.com/products/nike-grey-air-vapormax-plus-trainers/10090186-1-micagreen?$XXL$&wid=513&fit=constrain',
        title: 'Nike Air Vapormax Plus Trainers',
        description: 'Breathable textile upper, so they stay fresher for longer',
        price: 357.68,
        color: 'Grey',
        size: '8,7,9',
        quantity: 15,
        department: 'Women',
        category: 'Trainers',
    }),
    new Product({
        _id: "5bedf448c14d7822b39d9d47",
        imagePath: 'http://images.asos-media.com/products/adidas-originals-white-continental-80-trainers/10520022-1-ftwrwhite?$XXL$&wid=513&fit=constrain',
        title: 'adidas Originals Continental 80 trainers',
        description: 'Breathable textile upper, so they stay fresher for longer',
        price: 157.80,
        color: 'White',
        size: '7,10,11',
        quantity: 90,
        department: 'Women',
        category: 'Trainers',
    }),
    new Product({
        _id: "5bedf55bc14d7822b39d9d4b",
        imagePath: 'http://images.asos-media.com/products/fila-pink-taped-logo-disruptor-2-premium-trainers/9945131-1-pink?$XXL$&wid=513&fit=constrain',
        title: 'Fila Taped Logo Disruptor 2 Premium Trainers',
        description: 'Leather upper. It is the real deal',
        price: 178.84,
        color: 'Pink',
        size: '9,8,10',
        quantity: 4,
        department: 'Women',
        category: 'Trainers',
    }),
    new Product({
        _id: "5bedf55bc14d7822b39d9d5b",
        imagePath: 'http://images.asos-media.com/products/adidas-originals-deerupt-trainers-in-white-and-lilac/9631026-1-white?$XXL$&wid=513&fit=constrain',
        title: 'adidas Originals Deerupt Trainers',
        description: 'We’re testing a spin-set, triple-axis robot known as MATT (stands for Mechanical Arm Turns Things), helping you see trainers from more angles than ever before.',
        price: 168.32,
        color: 'White',
        size: '9,8,10',
        quantity: 4,
        department: 'Women',
        category: 'Trainers',
    }),
    new Product({
        _id: "5bedf6b5c14d7822b39d9d51",
        imagePath: 'http://images.asos-media.com/products/nike-m2k-tekno-trainers-in-white-av4789-004/10128855-1-white?$XXL$&wid=513&fit=constrain',
        title: 'Nike M2K Tekno Trainers In White ',
        description: 'Breathable textile upper, so they stay fresher for longer',
        price: 189.36,
        color: 'White',
        size: '9,10,11',
        quantity: 5,
        department: 'Men',
        category: 'Trainers',
    }),
    new Product({
        _id: "5bedf5eec14d7822b39d9d4e",
        imagePath: 'http://images.asos-media.com/products/nike-air-max-97-trainers-in-black-921826-008/9536967-1-black?$XXL$&wid=513&fit=constrain',
        title: 'Nike Air Max 97 Trainers',
        description: 'Breathable mesh upper. Keeps them fresher for longer ',
        price: 213.56,
        color: 'Black',
        size: '10,11',
        quantity: 80,
        department: 'Men',
        category: 'Trainers',
    }),
    new Product({
        _id: "5bedf7ecc14d7822b39d9d55",
        imagePath: 'http://images.asos-media.com/products/puma-cell-venom-trainers-in-white/11017775-1-white?$XXL$&wid=513&fit=constrain',
        title: 'Puma Cell Venom trainers ',
        description: 'Textile upper. No sheen, just feels',
        price: 199.88,
        color: 'White-Blue',
        size: '8,9,10,11,12',
        quantity: 8,
        department: 'Men',
        category: 'Trainers',
    }),
    new Product({
        _id: "5bedf720c14d7822b39d9d52",
        imagePath: 'http://images.asos-media.com/products/nike-air-max-95-og-trainers-in-orange-at2865-200/9536959-1-orange?$XXL$&wid=513&fit=constrain',
        title: 'Nike Air Max 95 OG Trainers',
        description: 'Breathable mesh upper. Keeps them fresher for longer ',
        price: 191.46,
        color: 'Orange',
        size: '9,10',
        quantity: 12,
        department: 'Men',
        category: 'Trainers',
    }),
    new Product({
        _id: "5bedf720c14d7822b39d9d58",
        imagePath: 'http://images.asos-media.com/products/puma-thunder-spectra-trainers-in-grey/9833634-1-grey?$XXL$&wid=513&fit=constrain',
        title: 'Puma Thunder Spectra trainers',
        description: 'Breathable mesh upper. Keeps them fresher for longer ',
        price: 191.46,
        color: 'Grey',
        size: '9,10',
        quantity: 12,
        department: 'Men',
        category: 'Trainers',
    })
];

for (let i = 0; i < products.length; i++){
    products[i].save(function(e, r) {
        if (i === products.length - 1){
            exit();
        }
    });
}

var variants =
[
    new Variant({
        productID: '5bedf31cc14d7822b39d9d43',
        imagePath: 'http://images.asos-media.com/products/adidas-originals-falcon-premium-leather-trainers-in-white/10291491-1-crystalwhite?$XXL$&wid=513&fit=constrain',
        color: 'White',
        size: '10,11',
        quantity: 5,
    }),
    new Variant({
        productID: '5bedf3b9c14d7822b39d9d45',
        imagePath: 'http://images.asos-media.com/products/nike-burgundy-air-vapormax-plus-trainers/10090191-2?$XXL$&wid=513&fit=constrain',
        color: ' Burgundy crush',
        size: '8,10,11',
        quantity: 12,
    }),
    new Variant({
        productID: '5bedf448c14d7822b39d9d47',
        imagePath: 'http://images.asos-media.com/products/adidas-originals-continental-80s-trainers-in-pink/9976703-1-pink?$XXL$&wid=513&fit=constrain',
        color: 'Pink',
        size: '9,10,11',
        quantity: 4,
    }),
    new Variant({
        productID: '5bedf448c14d7822b39d9d47',
        imagePath: 'http://images.asos-media.com/products/adidas-originals-black-continental-80-trainers/10520032-1-coreblack?$XXL$&wid=513&fit=constrain',
        color: 'Black',
        size: '7,8,10',
        quantity: 5,
    }),
    new Variant({
        productID: '5bedf5eec14d7822b39d9d4e',
        imagePath: 'http://images.asos-media.com/products/nike-air-max-97-trainers-in-silver/10128320-1-silver?$XXL$&wid=513&fit=constrain',
        color: 'Silver',
        size: '9,10',
        quantity: 35,
    }),
    new Variant({
        productID: '5bedf720c14d7822b39d9d52',
        imagePath: 'http://images.asos-media.com/products/nike-air-max-95-trainers-in-white-609048-109/6415976-1-white?$XXL$&wid=513&fit=constrain',
        color: 'White',
        size: '9',
        quantity: 5,
    })
];

for (let i = 0; i < variants.length; i++){
    variants[i].save(function(e, r) {
        if (i === variants.length - 1){
            exit();
        }
    });
}

var newUser = new User({
    username    : 'admin@admin.com',
    password    : 'admin',
    fullname    : 'Artyom Morozov',
    admin       : true
});
var buyer = new User({
  username    : 'buyer@buyer.com',
  password    : '1234',
  fullname    : 'Test Buyer',
  admin       : true
})
User.createUser(buyer, function(err, user){
    if(err) throw err;
    console.log(user);
});
User.createUser(newUser, function(err, user){
    if(err) throw err;
    console.log(user);
});

function exit() {
    mongoose.disconnect();
}
