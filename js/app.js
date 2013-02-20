/*global App*/

window.App = Ember.Application.create({
    ready: function() {
        $('#loading').remove();
    }
});

// Routes
App.Router.map(function() {
  this.resource('rooms', function() {
    this.resource('room', { path: '/:room_id' });
  });
  this.resource('ideaBooks', function() {
    this.resource('ideaBook', { path: '/:ibook_id' });
  });
  this.resource('catalogues', function() {
  	this.resource('furnitureStores', function(){ 
  		this.resource('furnitureStore', { path: '/:furnitureStore_id' }, 
	  		function(){
	  			this.resource('products', function() {
	  				this.resource('product', { path: '/:product_id'});
	  			});
	  		}
	  	);
  	});
  });
  this.resource('users', function() {
    this.resource('user', { path: '/:user_id' });
  });
});

//View
App.RoomView = Ember.View.extend({
	templateName: 'room'
});

App.RoomsRoute = Ember.Route.extend({
  model: function() {
    return App.Room.find();
  }
});

App.IdeaBooksRoute = Ember.Route.extend({
  model: function() {
    return App.IdeaBook.find();
  }
});

App.CataloguesRoute = Ember.Route.extend({
  setupController: function() {
    this.controllerFor('furnitureStores').set('model', App.FurnitureStore.find());
  },
  model: function() {
    return App.Catalogue.find();
  }
});

App.UsersRoute = Ember.Route.extend({
  model: function() {
    return App.User.find();
  }
});

App.FurnitureStoresRoute = Ember.Route.extend({
  model: function() {
    return App.FurnitureStore.find();
  }
});

App.ProductsRoute = Ember.Route.extend({
  model: function() {
    return App.Product.find();
  }
});

// Controllers
// Implement explicitly to use the object proxy.
App.ApplicationController = Ember.Controller.extend({
});

App.HomeController = Ember.Controller.extend();

App.RoomsController = Ember.ArrayController.extend({
  sortProperties: ['id']
});

App.IdeaBooksController = Ember.ArrayController.extend({
  sortProperties: ['id']
});

App.ProductsController = Ember.ArrayController.extend({
  sortProperties: ['id']
});

App.FurnitureStoresController = Ember.ArrayController.extend({
  sortProperties: ['id']
});

App.CataloguesController = Ember.ArrayController.extend({
  sortProperties: ['id']
});

App.UsersController = Ember.ArrayController.extend({
  sortProperties: ['id']
});

App.FurnitureStoreController = Ember.ArrayController.extend();

App.ProductController = Ember.ArrayController.extend();

// Handlebars Helpers
Ember.Handlebars.registerBoundHelper('money', function(value) {
  if (isNaN(value)) { return "0.00"; }
  return (value % 100 === 0 ? 
          value / 100 + ".00" : 
          parseInt(value / 100, 10) + "." + value % 100);
});

Ember.Handlebars.registerBoundHelper('date', function(value) {
  if (isNaN(value)) { return new Date(); }
  var month = value.getMonth() + 1; // Months are zero based
  return (value.getDate() + '/' + month + '/' + value.getFullYear());
});


// Models
App.Store = DS.Store.extend({
  revision: 11,
  adapter: 'DS.FixtureAdapter'  //local data
});

App.Room = DS.Model.extend({
  name: DS.attr('string'),
  type: DS.belongsTo('App.RoomType'),
  images: DS.hasMany('App.Image'),
  house: DS.belongsTo('App.House')
});

App.RoomType = DS.Model.extend({
  name: DS.attr('string')
});

App.House = DS.Model.extend({
  name: DS.attr('string'),
  image: DS.belongsTo('App.Image'),
  location: DS.attr('string'),
  owner: DS.belongsTo('App.User')
});

App.User = DS.Model.extend({
  firstName: DS.attr('string'),
  lastName: DS.attr('string'),
  fullName: function(){
  	return this.get('firstName') + ' ' + this.get('lastName');
  }.property('firstName','lastName'),
  image: DS.belongsTo('App.Image'),
  houses: DS.hasMany('App.House'),
  ideaBooks: DS.hasMany('App.IdeaBook')
});

App.Product = DS.Model.extend({
  name: DS.attr('string'),
  type: DS.attr('string'),
  roomTypes: DS.hasMany('App.RoomType'),
  style: DS.belongsTo('App.Style'),
  cents: DS.attr('number'),
  image: DS.belongsTo('App.Image'),
  isNew: DS.attr('boolean'),
  furnitureStore: DS.belongsTo('App.FurnitureStore')
});

App.Style = DS.Model.extend({
  name: DS.attr('string')
});

App.FurnitureStore = DS.Model.extend({
  name: DS.attr('string'),
  image: DS.belongsTo('App.Image'),
  catalogues: DS.hasMany('App.Catalogue')
});

App.Catalogue = DS.Model.extend({
	name : DS.attr('string'), 
	number : DS.attr('number'),
	date : DS.attr('date'),
	catalogueItems : DS.hasMany('App.catalogueItem'),
	furnitureStore: DS.belongsTo('App.FurnitoreStore')
});

App.CatalogueItem = DS.Model.extend({
  cents: DS.attr('number'),
  product: DS.belongsTo('App.Product')
});

App.IdeaBook = DS.Model.extend({ 
  ideaBookItems: DS.hasMany('App.IdeaBookItem'),
  date : DS.attr('date'),
  room: DS.belongsTo('App.Room'),
  style: DS.belongsTo('App.Style'),
  cents: function() {
    return this.get('ideaBookItems').getEach('cents').reduce(function(accum, item) {
      return accum + item;
    }, 0);
  }.property('ideaBookItems.@each.cents')
});

App.IdeaBookItem = DS.Model.extend({
  cents: DS.attr('number'),
  product: DS.belongsTo('App.Product'),
  coordinate: DS.belongsTo('App.Coordinate'),
});

App.Coordinate = DS.Model.extend({
  x: DS.attr('number'),
  y: DS.attr('number')
});

App.Image = DS.Model.extend({
	description: DS.attr('string'),
	smallImageUrl: DS.attr('string'),
	largeImageUrl: DS.attr('string')
});

//  DATA  
App.Room.FIXTURES = [{
  id: 1,
  name: "Principal",
  type: 1,
  images: [ 1 ],
  house: 1
}, {
  id: 2,
  name: "Dinning",
  type: 2,
  images: [  3, 4 ],
  house: 1
}, {
  id: 3,
  name: "Kitchen",
  type: 3,
  images: [ 5, 6, 7 ],
  house: 1
}, {
  id: 4,
  name: "Family",
  type: 9,
  images: [ 8, 9, 10, 13 ],
  house: 1
}, {
  id: 5,
  name: "Jack & Jill",
  type: 4 ,
  images: [ 11, 12 ],
  house: 1
}, {
  id: 6,
  name: "Master",
  type: 5,
  images: [ 14 ],
  house: 1
}, {
  id: 7,
  name: "Ensuite",
  type: 4,
  images: [ 15, 16 ],
  house: 1
}, {
  id: 8,
  name: "2nd Main Bath",
  type: 4,
  images: [ 17 ],
  house: 1
}, {
  id: 9,
  name: "Living",
  type: 6,
  images: [ 18 ],
  house: 1
}, {
  id: 10,
  name: "Loft",
  type: 7,
  images: [ 19 ],
  house: 1
}];

App.RoomType.FIXTURES = [{
  id: 1,
  name: "Hall"
},{
  id: 2,
  name: "Dinning"
},{
  id: 3,
  name: "Kitchen"
},{
  id: 4,
  name: "Bathroom"
},{
  id: 5,
  name: "Bedroom"
},{
  id: 6,
  name: "Living"
},{
  id: 7,
  name: "Loft"
},{
  id: 8,
  name: "Den"
},{
  id: 9,
  name: "Family"
},{
  id: 10,
  name: "Basement"
}
];

App.House.FIXTURES = [{
  id: 1,
  name: "Menlo Park III",
  image: 20,
  location: "Kanata, ON",
  owner: 1
}];

App.User.FIXTURES = [{
  id: 1,
  firstName: "Han",
  lastName: "Solo",
  image: 21,
  houses: [ 1 ] ,
  ideaBooks: [1, 2, 3, 4]
}];

App.IdeaBook.FIXTURES = [{
  id: 1,
  ideaBookItems: [ 1, 2, 3 ],
  date : "02/15/2013",
  style: 3,
  room: 1
},{
  id: 2,
  ideaBookItems: [ 4, 5, 6 ],
  date : "02/10/2013",
  style: 3,
  room: 2
},{
  id: 3,
  ideaBookItems: [ 7, 8, 9 ],
  date : "02/09/2013",
  style: 3,
  room: 3
}];

App.IdeaBookItem.FIXTURES = [{
  id: 1,
  cents: 200,
  product: 1,
  coordinate: 1,
},{
  id: 2,
  cents: 5000,
  product: 2,
  coordinate: 2,
},{
  id: 3,
  cents: 1500,
  product: 2,
  coordinate: 2,
}];

App.Coordinate.FIXTURES = [{
  id : 1,
  x: 0,
  y: 0
},{
  id : 2,
  x: 1,
  y: 1
}];

App.Product.FIXTURES = [{
  id : 1,
  name: 'TROFAST',
  type: 'Frame',
  roomTypes: [5, 10],
  style: 3,
  cents: 10500,
  images: 29 ,
  isNew: false,
  furnitureStore: 1
},{
  id : 2,
  name: 'MAMMUT',
  type: '3 drawer chest',
  roomTypes: [5, 10],
  style: 3,
  cents: 14900,
  images: 30,
  isNew: true,
  furnitureStore: 1
},{
  id : 3,
  name: 'RYMDEN',
  type: 'Led ceiling track, 3 spots',
  roomTypes: [1, 6, 7, 10],
  style: 3,
  cents: 3499,
  images: 31 ,
  isNew: false,
  furnitureStore: 1
},{
  id : 4,
  name: 'IKEA PS 2012',
  type: 'Led wall lamp',
  roomTypes: [1, 6, 7, 10],
  style: 3,
  cents: 5999,
  images: 32 ,
  isNew: false,
  furnitureStore: 1
},{
  id : 5,
  name: 'ENGAN',
  type: 'Nightstand',
  roomTypes: [ 5 ],
  style: 3,
  cents: 5999,
  images: 33 ,
  isNew: true,
  furnitureStore: 1
},{
  id : 6,
  name: 'IKEA PS 2012',
  type: 'Picture',
  roomTypes: [ 4 , 5 ],
  style: 3,
  cents: 3999,
  images: 34,
  isNew: true,
  furnitureStore: 1
},{
  id : 7,
  name: 'TRIVSAM',
  type: 'Gravy boat',
  roomTypes: [ 3 ],
  style: 3,
  cents: 699,
  images: 35,
  isNew: true,
  furnitureStore: 1
},{
  id : 8,
  name: 'FORSLA',
  type: 'Bowl',
  roomTypes: [ 3 ],
  style: 3,
  cents: 199,
  images: 36,
  isNew: false,
  furnitureStore: 1
},{
  id : 9,
  name: 'POANG Rocking chair',
  type: 'Bowl',
  roomTypes: [ 5, 10 ],
  style: 3,
  cents: 19900,
  images: 37 ,
  isNew: true,
  furnitureStore: 1
},{
  id : 10,
  name: 'KARLSTAD',
  type: 'Armchair',
  roomTypes: [ 5, 6 , 10 ],
  style: 3,
  cents: 79900,
  images: 38,
  isNew: false,
  furnitureStore: 1
},{
  id : 11,
  name: 'ULBERG',
  type: 'Nightstand',
  roomTypes: 5 ,
  style: 3,
  cents: 3499,
  images: [ 39 ],
  isNew: true,
  furnitureStore: 1
},{
  id : 12,
  name: 'BESTA / FRAMSTA',
  type: 'TV/storage',
  roomTypes: [ 9 , 10 ],
  style: 3,
  cents: 64500,
  images: 40 ,
  isNew: true,
  furnitureStore: 1
},{
  id : 13,
  name: 'ARVIKA',
  type: 'Swivel armchair',
  roomTypes: [ 5 , 6 , 10 ],
  style: 3,
  cents: 59900,
  images: 41,
  isNew: false,
  furnitureStore: 1
},{
  id : 14,
  name: 'BJURSTA',
  type: 'Extendable table',
  roomTypes: [ 2 ],
  style: 3,
  cents: 26900,
  images:  42 ,
  isNew: true,
  furnitureStore: 1
},{
  id : 15,
  name: 'HJALMAREN',
  type: 'Toilet roll holder',
  roomTypes: [ 4 ],
  style: 3,
  cents: 799,
  images: 43 ,
  isNew: true,
  furnitureStore: 1
},{
  id : 16,
  name: 'HOPEN',
  type: '6-drawer chest',
  roomTypes: [ 6 , 8 , 9 ],
  style: 3,
  cents: 24900,
  images: 44 ,
  isNew: false,
  furnitureStore: 1
},{
  id : 17,
  name: 'MAMMUT',
  type: 'Childre\'s stool',
  roomTypes: [ 5 , 7 , 10 ],
  style: 3,
  cents: 999,
  images: 45 ,
  isNew: false,
  furnitureStore: 1
},{
  id : 18,
  name: 'ELMER',
  type: 'Chair',
  roomTypes: [ 3 , 6 , 10 ],
  style: 3,
  cents: 8999,
  images: 45 ,
  isNew: true,
  furnitureStore: 1
}];

App.Style.FIXTURES = [{
  id: 1,
  name: 'Contemporary'
},{
  id: 2,
  name: 'Eclectic'
},{
  id: 3,
  name: 'Modern'
},{
  id: 4,
  name: 'Traditional'
},{
  id: 5,
  name: 'Asian'
},{
  id: 6,
  name: 'Mediterranean'
},{
  id: 7,
  name: 'Tropical'
},{
  id: 8,
  name: 'Country'
}];

App.FurnitureStore.FIXTURES = [{
  id: 1,
  name: 'Ikea',
  image: 22,
  catalogues: [ 1 , 2 ]
},{
  id: 2,
  name: 'Mobilia',
  image: 23,
  catalogues: [ 3 ]
},{
  id: 3,
  name: 'Sears',
  image: 24,
  catalogues: [ 4 ]
},{
  id: 4,
  name: 'Waltmart',
  image: 25,
  catalogues: [ 5 ]
},{
  id: 5,
  name: 'Structube',
  image: 26,
  catalogues: [ 6 ]
},{
  id: 6,
  name: 'EQ3',
  image: 27,
  catalogues: [ 7 ]
},{
  id: 7,
  name: 'Mikaza',
  image: 28,
  catalogues: [ 8 ]
}];

App.Catalogue.FIXTURES = [{
	id: 1,
	name : 'Winter 2012 - 2013', 
	number : 133,
	date : '15/11/2012',
	catalogueItems : [1,2,3,4,5,6,7,8,14,16],
	furnitureStore: 1
}, {
	id: 2,
	name : 'Spring 2013', 
	number : 134,
	date : '15/03/2012',
	catalogueItems : [9,10,11,12,13,15,17,18],
	furnitureStore: 1
},{
	id: 3,
	name : 'Winter 2012 - 2013', 
	number : 123,
	date : '15/11/2012',
	catalogueItems : [],
	furnitureStore: 2
}, {
	id: 4,
	name : 'Spring 2013', 
	number : 764,
	date : '15/03/2012',
	catalogueItems : [],
	furnitureStore: 3
},{
	id: 5,
	name : 'Winter 2012 - 2013', 
	number : 22,
	date : '15/11/2012',
	catalogueItems : [],
	furnitureStore: 4
}, {
	id: 6,
	name : 'Spring 2013', 
	number : 312,
	date : '15/03/2012',
	catalogueItems : [],
	furnitureStore: 5
}, {
	id: 7,
	name : 'Spring 2013', 
	number : 433,
	date : '15/03/2012',
	catalogueItems : [],
	furnitureStore: 6
},{
	id: 8,
	name : 'Winter 2012 - 2013', 
	number : 342,
	date : '15/11/2012',
	catalogueItems : [],
	furnitureStore: 7
}];

App.Image.FIXTURES = [{
	id: 1,
	description: 'Menlo Park III - Hall',
	smallImageUrl: 'img/room01_01small.jpg',
	largeImageUrl: 'img/room01_01large.jpg'
},{
	id: 2,
	description: 'Menlo Park III - Dinning',
	smallImageUrl: 'img/room02_01small.jpg',
	largeImageUrl: 'img/room02_01large.jpg'
},{
	id: 3,
	description: 'Menlo Park III - Dinning',
	smallImageUrl: 'img/room02_02small.jpg',
	largeImageUrl: 'img/room02_02large.jpg'
},{
	id: 4,
	description: 'Menlo Park III - Dinning',
	smallImageUrl: 'img/room02_03small.jpg',
	largeImageUrl: 'img/room02_03large.jpg'
},{
	id: 5,
	description: 'Menlo Park III - Kitchen',
	smallImageUrl: 'img/room03_01small.jpg',
	largeImageUrl: 'img/room03_01large.jpg'
},{
	id: 6,
	description: 'Menlo Park III - Kitchen',
	smallImageUrl: 'img/room03_02small.jpg',
	largeImageUrl: 'img/room03_02large.jpg'
},{
	id: 7,
	description: 'Menlo Park III - Kitchen',
	smallImageUrl: 'img/room03_03small.jpg',
	largeImageUrl: 'img/room03_03large.jpg'
},{
	id: 8,
	description: 'Menlo Park III - Family',
	smallImageUrl: 'img/room04_01small.jpg',
	largeImageUrl: 'img/room04_01large.jpg'
},{
	id: 9,
	description: 'Menlo Park III - Family',
	smallImageUrl: 'img/room04_02small.jpg',
	largeImageUrl: 'img/room04_02large.jpg'
},{
	id: 10,
	description: 'Menlo Park III - Family',
	smallImageUrl: 'img/room04_03small.jpg',
	largeImageUrl: 'img/room04_03large.jpg'
},{
	id: 11,
	description: 'Menlo Park III - Bath Jack & Jill',
	smallImageUrl: 'img/room05_01small.jpg',
	largeImageUrl: 'img/room05_01large.jpg'
},{
	id: 12,
	description: 'Menlo Park III - Bath Jack & Jill',
	smallImageUrl: 'img/room05_02small.jpg',
	largeImageUrl: 'img/room05_02large.jpg'
},{
	id: 13,
	description: 'Menlo Park III - Family',
	smallImageUrl: 'img/room04_04small.jpg',
	largeImageUrl: 'img/room04_04large.jpg'
},{
	id: 14,
	description: 'Menlo Park III - Master Bedroom',
	smallImageUrl: 'img/room06_01small.jpg',
	largeImageUrl: 'img/room06_01large.jpg'
},{
	id: 15,
	description: 'Menlo Park III - Bath Ensuite',
	smallImageUrl: 'img/room07_01small.jpg',
	largeImageUrl: 'img/room07_01large.jpg'
},{
	id: 16,
	description: 'Menlo Park III - Bath Ensuite',
	smallImageUrl: 'img/room07_02small.jpg',
	largeImageUrl: 'img/room07_02large.jpg'
},{
	id: 17,
	description: 'Menlo Park III - 2nd Bath',
	smallImageUrl: 'img/room08_01small.jpg',
	largeImageUrl: 'img/room08_01large.jpg'
},{
	id: 18,
	description: 'Menlo Park III - Living',
	smallImageUrl: 'img/room09_01small.jpg',
	largeImageUrl: 'img/room09_01large.jpg'
},{
	id: 19,
	description: 'Menlo Park III - Loft',
	smallImageUrl: 'img/room10_01small.jpg',
	largeImageUrl: 'img/room10_01large.jpg'
},{
	id: 20,
	description: 'Menlo Park III',
	smallImageUrl: 'img/house01_01small.jpg',
	largeImageUrl: 'img/house01_01large.jpg'
},{
	id: 21,
	description: 'Han Solo',
	smallImageUrl: 'img/user01_01.jpg',
	largeImageUrl: 'img/user01_01.jpg'
},{
	id: 22,
	description: 'Ikea',
	smallImageUrl: 'img/store01_01small.jpg',
	largeImageUrl: ''
},{
	id: 23,
	description: 'Mobilia',
	smallImageUrl: 'img/store02_01small.jpg',
	largeImageUrl: ''
},{
	id: 24,
	description: 'Sears',
	smallImageUrl: 'img/store03_01small.jpg',
	largeImageUrl: ''
},{
	id: 25,
	description: 'Waltmart',
	smallImageUrl: 'img/store04_01small.jpg',
	largeImageUrl: ''
},{
	id: 26,
	description: 'Structube',
	smallImageUrl: 'img/store05_01small.jpg',
	largeImageUrl: ''
},{
	id: 27,
	description: 'EQ3',
	smallImageUrl: 'img/store06_01small.jpg',
	largeImageUrl: ''
},{
	id: 28,
	description: 'Mikaza',
	smallImageUrl: 'img/store07_01small.jpg',
	largeImageUrl: ''
},{
	id: 29,
	description: 'TROFAST Frame',
	smallImageUrl: 'img/product01_01small.png',
	largeImageUrl: 'img/product01_01large.jpg'
},{
	id: 30,
	description: 'MAMMUT 3 drawer chest',
	smallImageUrl: 'img/product02_01small.png',
	largeImageUrl: 'img/product02_01large.jpg'
},{
	id: 31,
	description: 'RYMDEN Led ceiling track, 3 spots',
	smallImageUrl: 'img/product03_01small.png',
	largeImageUrl: 'img/product03_01large.jpg'
},{
	id: 32,
	description: 'IKEA PS 2012 LED wall lamp',
	smallImageUrl: 'img/product04_01small.png',
	largeImageUrl: 'img/product04_01large.jpg'
},{
	id: 33,
	description: 'ENGAN Nightstand',
	smallImageUrl: 'img/product05_01small.png',
	largeImageUrl: 'img/product05_01large.jpg'
},{
	id: 34,
	description: 'IKEA PS 2012',
	smallImageUrl: 'img/product06_01small.png',
	largeImageUrl: 'img/product06_01large.jpg'
},{
	id: 35,
	description: 'TRIVSAM Gravy boat',
	smallImageUrl: 'img/product07_01small.png',
	largeImageUrl: 'img/product07_01large.jpg'
},{
	id: 36,
	description: 'FORSLA Bowl',
	smallImageUrl: 'img/product08_01small.png',
	largeImageUrl: 'img/product08_01large.jpg'
},{
	id: 37,
	description: 'POANG Rocking chair',
	smallImageUrl: 'img/product09_01small.png',
	largeImageUrl: 'img/product09_01large.jpg'
},{
	id: 38,
	description: 'KARLSTAD Armchair',
	smallImageUrl: 'img/product10_01small.png',
	largeImageUrl: 'img/product10_01large.jpg'
},{
	id: 39,
	description: 'ULSBERD Nightstand',
	smallImageUrl: 'img/product11_01small.png',
	largeImageUrl: 'img/product11_01small.jpg'
},{
	id: 40,
	description: 'BESTA/FRAMSTA TV/storage',
	smallImageUrl: 'img/product12_01small.png',
	largeImageUrl: 'img/product12_01large.jpg'
},{
	id: 41,
	description: 'ARVIKA Swivel armchair',
	smallImageUrl: 'img/product13_01small.png',
	largeImageUrl: 'img/product13_01large.jpg'
},{
	id: 42,
	description: 'BJURSTA Extendable table',
	smallImageUrl: 'img/product14_01small.png',
	largeImageUrl: 'img/product14_01large.jpg'
},{
	id: 43,
	description: 'HJALMAREN Toiler roll holder',
	smallImageUrl: 'img/product14_01small.png',
	largeImageUrl: 'img/product14_01large.jpg'
},{
	id: 44,
	description: 'HOPEN 6-drawer chest',
	smallImageUrl: 'img/product16_01small.png',
	largeImageUrl: 'img/product16_01large.jpg'
},{
	id: 45,
	description: 'MAMMUT Chiden\'s stool',
	smallImageUrl: 'img/product17_01small.png',
	largeImageUrl: 'img/product17_01large.jpg'
},{
	id: 46,
	description: 'ELMER Chair',
	smallImageUrl: 'img/product18_01small.png',
	largeImageUrl: 'img/product18_01large.jpg'
}];