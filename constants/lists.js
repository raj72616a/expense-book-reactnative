let Tag = [
	'💰',
	'👛',
	'💸',
	'🏦',
	'💳'
];

let Category = [
	'Food',
	'Transport',
	'Utility',
	'Housing',
	'Education',
	'Clothing',
	'Household',
	'Healthcare',
	'Entertainment',
	'Others'
];

let CategoryCol1 = Category.filter( (itm,key) => (key % 2) == 0 );
let CategoryCol2 = Category.filter( (itm,key) => (key % 2) == 1 );

export const lists = {
	Tag : Tag,
	Category : Category,
	CategoryCol1 : CategoryCol1,
	CategoryCol2 : CategoryCol2
}