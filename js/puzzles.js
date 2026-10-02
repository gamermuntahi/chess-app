// PUZZLE DATA + PUZZLE MODE LOGIC
const PUZZLES={
easy:
[
{b:[[null,null,null,null,null,null,null,'bK'],[null,null,null,null,null,'wK','bP','bP'],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,'wR',null,null]],turn:'w',sol:[[7,5,0,5]],label:'Rook f1 to f8 checkmate'},
{b:[[null,null,null,null,null,null,null,'bK'],[null,null,null,null,null,'wK','bP','bP'],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,'wR',null,null],[null,null,null,null,null,null,null,null]],turn:'w',sol:[[6,5,0,5]],label:'Rook f2 to f8 checkmate'},
{b:[[null,null,null,null,null,null,null,'bK'],[null,null,null,null,null,'wK','bP','bP'],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,'wR',null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null]],turn:'w',sol:[[5,5,0,5]],label:'Rook f3 to f8 checkmate'},
{b:[[null,null,null,null,null,null,null,'bK'],[null,null,null,null,null,'wK','bP','bP'],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,'wR',null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null]],turn:'w',sol:[[4,5,0,5]],label:'Rook f4 to f8 checkmate'},
{b:[[null,null,null,null,null,null,null,'bK'],[null,null,null,null,null,'wK','bP','bP'],[null,null,null,null,null,null,null,null],[null,null,null,null,null,'wR',null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null]],turn:'w',sol:[[3,5,0,5]],label:'Rook f5 to f8 checkmate'},
{b:[[null,null,null,null,null,null,null,'bK'],[null,null,null,null,null,null,'bP','bP'],[null,null,null,null,null,'wN',null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,'wK','wR',null,null]],turn:'w',sol:[[7,5,0,5]],label:'Rook f1 to f8 knight covers g8'},
{b:[[null,null,null,null,null,null,null,'bK'],[null,null,null,null,null,null,'bP','bP'],[null,null,null,null,null,'wN',null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,'wR',null,null],[null,null,null,null,'wK',null,null,null]],turn:'w',sol:[[6,5,0,5]],label:'Rook f2 to f8 knight covers g8'},
{b:[[null,null,null,null,null,null,null,'bK'],[null,null,null,null,null,null,'bP','bP'],[null,null,null,null,null,'wN',null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,'wR',null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,'wK',null,null,null]],turn:'w',sol:[[5,5,0,5]],label:'Rook f3 to f8 knight covers g8'},
{b:[[null,null,null,null,null,null,null,'bK'],[null,null,null,null,null,null,'bP','bP'],[null,null,null,null,null,'wN',null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,'wR',null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,'wK',null,null,null]],turn:'w',sol:[[4,5,0,5]],label:'Rook f4 to f8 knight covers g8'},
{b:[['bK',null,null,null,null,null,null,null],['bP','bP','wK',null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,'wR',null,null,null,null,null,null]],turn:'w',sol:[[7,1,0,1]],label:'Rook b1 to b8 checkmate'},
{b:[['bK',null,null,null,null,null,null,null],['bP','bP','wK',null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,'wR',null,null,null,null,null,null],[null,null,null,null,null,null,null,null]],turn:'w',sol:[[6,1,0,1]],label:'Rook b2 to b8 checkmate'},
{b:[['bK',null,null,null,null,null,null,null],['bP','bP','wK',null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,'wR',null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null]],turn:'w',sol:[[5,1,0,1]],label:'Rook b3 to b8 checkmate'},
{b:[['bK',null,null,null,null,null,null,null],['bP','bP','wK',null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,'wR',null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null]],turn:'w',sol:[[4,1,0,1]],label:'Rook b4 to b8 checkmate'},
{b:[['bK',null,null,null,null,null,null,null],['bP','bP','wK',null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,'wR',null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null]],turn:'w',sol:[[3,1,0,1]],label:'Rook b5 to b8 checkmate'},
{b:[['bK',null,null,null,null,null,null,null],['bP','bP','wK',null,null,null,null,null],[null,'wR',null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null]],turn:'w',sol:[[2,1,0,1]],label:'Rook b6 to b8 checkmate'},
{b:[[null,null,null,null,null,null,null,'bK'],[null,null,null,null,null,'wK','bP','bP'],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,'wR',null]],turn:'w',sol:[[7,6,0,6]],label:'Rook g1 to g8 wK f7 covers h7-f7'},
{b:[[null,null,null,null,null,null,null,'bK'],[null,null,null,null,null,'wK','bP','bP'],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,'wR',null],[null,null,null,null,null,null,null,null]],turn:'w',sol:[[6,6,0,6]],label:'Rook g2 to g8 wK f7 covers h7-f7'},
{b:[[null,null,null,null,null,null,null,'bK'],[null,null,null,null,null,'wK','bP','bP'],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,'wR',null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null]],turn:'w',sol:[[5,6,0,6]],label:'Rook g3 to g8 wK f7 covers h7-f7'},
{b:[[null,null,null,null,null,null,null,'bK'],[null,null,null,null,null,'wK','bP','bP'],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,'wR',null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null]],turn:'w',sol:[[4,6,0,6]],label:'Rook g4 to g8 wK f7 covers h7-f7'},
{b:[[null,null,null,null,null,null,null,'bK'],[null,null,null,null,null,'wK','bP','bP'],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,'wR',null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null]],turn:'w',sol:[[3,6,0,6]],label:'Rook g5 to g8 wK f7 covers h7-f7'},
],
medium:
[
{b:[[null,null,null,null,null,null,null,'bK'],[null,null,null,null,null,null,'bP','bP'],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,'wB',null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,'wK','wR',null,null]],turn:'w',sol:[[7,5,0,5]],label:'Rook f1 to f8 bishop c4 covers g8'},
{b:[[null,null,null,null,null,null,null,'bK'],[null,null,null,null,null,null,'bP','bP'],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,'wB',null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,'wR',null,null],[null,null,null,null,'wK',null,null,null]],turn:'w',sol:[[6,5,0,5]],label:'Rook f2 to f8 bishop c4 covers g8'},
{b:[[null,null,null,null,null,null,null,'bK'],[null,null,null,null,null,null,'bP','bP'],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,'wB',null,null,null,null,null],[null,null,null,null,null,'wR',null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,'wK',null,null,null]],turn:'w',sol:[[5,5,0,5]],label:'Rook f3 to f8 bishop c4 covers g8'},
{b:[[null,null,null,null,null,null,null,'bK'],[null,null,null,null,null,null,'bP','bP'],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,'wB',null,null,'wR',null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,'wK',null,null,null]],turn:'w',sol:[[4,5,0,5]],label:'Rook f4 to f8 bishop c4 covers g8'},
{b:[[null,null,null,null,null,null,null,'bK'],[null,null,null,null,null,null,'bP','bP'],[null,null,null,null,null,null,null,null],[null,null,null,null,null,'wR',null,null],[null,null,'wB',null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,'wK',null,null,null]],turn:'w',sol:[[3,5,0,5]],label:'Rook f5 to f8 bishop c4 covers g8'},
{b:[['bK',null,null,null,null,null,null,null],['bP','bP',null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,'wB',null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,'wR',null,null,'wK',null,null,null]],turn:'w',sol:[[7,1,0,1]],label:'Rook b1 to b8 bishop f4 covers b8'},
{b:[['bK',null,null,null,null,null,null,null],['bP','bP',null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,'wB',null,null],[null,null,null,null,null,null,null,null],[null,'wR',null,null,null,null,null,null],[null,null,null,null,'wK',null,null,null]],turn:'w',sol:[[6,1,0,1]],label:'Rook b2 to b8 bishop f4 covers b8'},
{b:[['bK',null,null,null,null,null,null,null],['bP','bP',null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,'wB',null,null],[null,'wR',null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,'wK',null,null,null]],turn:'w',sol:[[5,1,0,1]],label:'Rook b3 to b8 bishop f4 covers b8'},
{b:[['bK',null,null,null,null,null,null,null],['bP','bP',null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,'wR',null,null,null,'wB',null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,'wK',null,null,null]],turn:'w',sol:[[4,1,0,1]],label:'Rook b4 to b8 bishop f4 covers b8'},
{b:[['bK',null,null,null,null,null,null,null],['bP','bP',null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,'wR',null,null,null,null,null,null],[null,null,null,null,null,'wB',null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,'wK',null,null,null]],turn:'w',sol:[[3,1,0,1]],label:'Rook b5 to b8 bishop f4 covers b8'},
{b:[['bK',null,null,null,null,null,null,null],['bP','bP',null,null,null,null,null,null],[null,null,'wN',null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,'wR',null,null,'wK',null,null,null]],turn:'w',sol:[[7,1,0,1]],label:'Rook b1 to b8 knight c6 covers b8'},
{b:[['bK',null,null,null,null,null,null,null],['bP','bP',null,null,null,null,null,null],[null,null,'wN',null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,'wR',null,null,null,null,null,null],[null,null,null,null,'wK',null,null,null]],turn:'w',sol:[[6,1,0,1]],label:'Rook b2 to b8 knight c6 covers b8'},
{b:[['bK',null,null,null,null,null,null,null],['bP','bP',null,null,null,null,null,null],[null,null,'wN',null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,'wR',null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,'wK',null,null,null]],turn:'w',sol:[[5,1,0,1]],label:'Rook b3 to b8 knight c6 covers b8'},
{b:[['bK',null,null,null,null,null,null,null],['bP','bP',null,null,null,null,null,null],[null,null,'wN',null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,'wR',null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,'wK',null,null,null]],turn:'w',sol:[[4,1,0,1]],label:'Rook b4 to b8 knight c6 covers b8'},
{b:[['bK',null,null,null,null,null,null,null],['bP','bP',null,null,null,null,null,null],[null,null,'wN',null,null,null,null,null],[null,'wR',null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,'wK',null,null,null]],turn:'w',sol:[[3,1,0,1]],label:'Rook b5 to b8 knight c6 covers b8'},
{b:[[null,null,null,null,null,null,null,'bK'],[null,null,null,null,null,null,'bP','bP'],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,'wQ',null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,'wK','wR',null,null]],turn:'w',sol:[[7,5,0,5]],label:'Rook f1 to f8 queen b3 covers g8'},
{b:[[null,null,null,null,null,null,null,'bK'],[null,null,null,null,null,null,'bP','bP'],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],['wQ',null,null,null,null,'wR',null,null],[null,null,null,null,'wK',null,null,null]],turn:'w',sol:[[6,5,0,5]],label:'Rook f2 to f8 queen a2 covers g8'},
{b:[[null,null,null,null,null,null,null,'bK'],[null,null,null,null,null,null,'bP','bP'],[null,null,null,null,null,'wN',null,null],[null,null,null,null,null,null,null,null],[null,null,'wB',null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,'wK','wR',null,null]],turn:'w',sol:[[7,5,0,5]],label:'Rook to f8 Nf6 and Bc4 cover g8'},
{b:[[null,null,null,null,null,null,null,'bK'],[null,null,null,null,null,null,'bP','bP'],[null,null,null,null,null,'wN',null,null],[null,null,null,null,null,null,null,null],[null,null,'wB',null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,'wR',null,null],[null,null,null,null,'wK',null,null,null]],turn:'w',sol:[[6,5,0,5]],label:'Rook to f8 Nf6 and Bc4 cover g8'},
{b:[[null,null,null,null,null,null,null,'bK'],[null,null,null,null,null,null,'bP','bP'],[null,null,null,null,null,'wN',null,null],[null,null,null,null,null,null,null,null],[null,null,'wB',null,null,null,null,null],[null,null,null,null,null,'wR',null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,'wK',null,null,null]],turn:'w',sol:[[5,5,0,5]],label:'Rook to f8 Nf6 and Bc4 cover g8'},
],
hard:
[
{b:[[null,null,null,null,null,null,null,'bK'],[null,null,null,null,null,'wK','bP','bP'],[null,null,null,null,null,'wN',null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,'wR',null,null]],turn:'w',sol:[[7,5,0,5]],label:'Rook to f8 wK f7 and Nf6 cover g8'},
{b:[[null,null,null,null,null,null,null,'bK'],[null,null,null,null,null,'wK','bP','bP'],[null,null,null,null,null,'wN',null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,'wR',null,null],[null,null,null,null,null,null,null,null]],turn:'w',sol:[[6,5,0,5]],label:'Rook to f8 wK f7 and Nf6 cover g8'},
{b:[[null,null,null,null,null,null,null,'bK'],[null,null,null,null,null,'wK','bP','bP'],[null,null,null,null,null,'wN',null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,'wR',null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null]],turn:'w',sol:[[5,5,0,5]],label:'Rook to f8 wK f7 and Nf6 cover g8'},
{b:[[null,null,null,null,null,null,null,'bK'],[null,null,null,null,null,'wK','bP','bP'],[null,null,null,null,null,'wN',null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,'wR',null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null]],turn:'w',sol:[[4,5,0,5]],label:'Rook to f8 wK f7 and Nf6 cover g8'},
{b:[[null,null,null,null,null,null,null,'bK'],[null,null,null,null,null,'wK','bP','bP'],[null,null,null,null,null,'wN',null,null],[null,null,null,null,null,'wR',null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null]],turn:'w',sol:[[3,5,0,5]],label:'Rook to f8 wK f7 and Nf6 cover g8'},
{b:[['bK',null,null,null,null,null,null,null],['bP','bP','wK',null,null,null,null,null],[null,null,'wN',null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,'wR',null,null,null,null,null,null]],turn:'w',sol:[[7,1,0,1]],label:'Rook to b8 wK c7 and Nc6 cover b8'},
{b:[['bK',null,null,null,null,null,null,null],['bP','bP','wK',null,null,null,null,null],[null,null,'wN',null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,'wR',null,null,null,null,null,null],[null,null,null,null,null,null,null,null]],turn:'w',sol:[[6,1,0,1]],label:'Rook to b8 wK c7 and Nc6 cover b8'},
{b:[['bK',null,null,null,null,null,null,null],['bP','bP','wK',null,null,null,null,null],[null,null,'wN',null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,'wR',null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null]],turn:'w',sol:[[5,1,0,1]],label:'Rook to b8 wK c7 and Nc6 cover b8'},
{b:[['bK',null,null,null,null,null,null,null],['bP','bP','wK',null,null,null,null,null],[null,null,'wN',null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,'wR',null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null]],turn:'w',sol:[[4,1,0,1]],label:'Rook to b8 wK c7 and Nc6 cover b8'},
{b:[['bK',null,null,null,null,null,null,null],['bP','bP','wK',null,null,null,null,null],[null,null,'wN',null,null,null,null,null],[null,'wR',null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null]],turn:'w',sol:[[3,1,0,1]],label:'Rook to b8 wK c7 and Nc6 cover b8'},
{b:[[null,null,null,null,null,null,null,'bK'],[null,null,null,null,null,'wK','bP','bP'],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,'wB',null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,'wR',null,null]],turn:'w',sol:[[7,5,0,5]],label:'Rook to f8 wK f7 and Bc4 cover g8'},
{b:[['bK',null,null,null,null,null,null,null],['bP','bP','wK',null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,'wB',null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,'wR',null,null,null,null,null,null]],turn:'w',sol:[[7,1,0,1]],label:'Rook to b8 wK c7 and Bf4 cover b8'},
{b:[[null,null,null,null,null,null,null,'bK'],[null,null,null,null,null,'wK','bP','bP'],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,'wB',null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,'wR',null,null],[null,null,null,null,null,null,null,null]],turn:'w',sol:[[6,5,0,5]],label:'Rook to f8 wK f7 and Bc4 cover g8'},
{b:[['bK',null,null,null,null,null,null,null],['bP','bP','wK',null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,'wB',null,null],[null,null,null,null,null,null,null,null],[null,'wR',null,null,null,null,null,null],[null,null,null,null,null,null,null,null]],turn:'w',sol:[[6,1,0,1]],label:'Rook to b8 wK c7 and Bf4 cover b8'},
{b:[[null,null,null,null,null,null,null,'bK'],[null,null,null,null,null,'wK','bP','bP'],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,'wB',null,null,null,null,null],[null,null,null,null,null,'wR',null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null]],turn:'w',sol:[[5,5,0,5]],label:'Rook to f8 wK f7 and Bc4 cover g8'},
{b:[['bK',null,null,null,null,null,null,null],['bP','bP','wK',null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,'wB',null,null],[null,'wR',null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null]],turn:'w',sol:[[5,1,0,1]],label:'Rook to b8 wK c7 and Bf4 cover b8'},
{b:[[null,null,null,null,null,null,null,'bK'],[null,null,null,null,null,'wK','bP','bP'],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,'wB',null,null,'wR',null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null]],turn:'w',sol:[[4,5,0,5]],label:'Rook to f8 wK f7 and Bc4 cover g8'},
{b:[['bK',null,null,null,null,null,null,null],['bP','bP','wK',null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,'wR',null,null,null,'wB',null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null]],turn:'w',sol:[[4,1,0,1]],label:'Rook to b8 wK c7 and Bf4 cover b8'},
{b:[[null,null,null,null,null,null,null,'bK'],[null,null,null,null,null,'wK','bP','bP'],[null,null,null,null,null,null,null,null],[null,null,null,null,null,'wR',null,null],[null,null,'wB',null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null]],turn:'w',sol:[[3,5,0,5]],label:'Rook to f8 wK f7 and Bc4 cover g8'},
{b:[['bK',null,null,null,null,null,null,null],['bP','bP','wK',null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,'wR',null,null,null,null,null,null],[null,null,null,null,null,'wB',null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null]],turn:'w',sol:[[3,1,0,1]],label:'Rook to b8 wK c7 and Bf4 cover b8'},
],
extreme:
[
{b:[[null,null,null,null,null,null,null,'bK'],[null,null,null,null,null,'wK','bP','bP'],[null,null,null,null,null,'wN',null,null],[null,null,null,null,null,null,null,null],[null,null,'wB',null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,'wR',null,null]],turn:'w',sol:[[7,5,0,5]],label:'Rook to f8 wK Bc4 Nf6 all cover g8'},
{b:[[null,null,null,null,null,null,null,'bK'],[null,null,null,null,null,'wK','bP','bP'],[null,null,null,null,null,'wN',null,null],[null,null,null,null,null,null,null,null],[null,null,'wB',null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,'wR',null,null],[null,null,null,null,null,null,null,null]],turn:'w',sol:[[6,5,0,5]],label:'Rook to f8 wK Bc4 Nf6 all cover g8'},
{b:[[null,null,null,null,null,null,null,'bK'],[null,null,null,null,null,'wK','bP','bP'],[null,null,null,null,null,'wN',null,null],[null,null,null,null,null,null,null,null],[null,null,'wB',null,null,null,null,null],[null,null,null,null,null,'wR',null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null]],turn:'w',sol:[[5,5,0,5]],label:'Rook to f8 wK Bc4 Nf6 all cover g8'},
{b:[[null,null,null,null,null,null,null,'bK'],[null,null,null,null,null,'wK','bP','bP'],[null,null,null,null,null,'wN',null,null],[null,null,null,null,null,null,null,null],[null,null,'wB',null,null,'wR',null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null]],turn:'w',sol:[[4,5,0,5]],label:'Rook to f8 wK Bc4 Nf6 all cover g8'},
{b:[[null,null,null,null,null,null,null,'bK'],[null,null,null,null,null,'wK','bP','bP'],[null,null,null,null,null,'wN',null,null],[null,null,null,null,null,'wR',null,null],[null,null,'wB',null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null]],turn:'w',sol:[[3,5,0,5]],label:'Rook to f8 wK Bc4 Nf6 all cover g8'},
{b:[['bK',null,null,null,null,null,null,null],['bP','bP','wK',null,null,null,null,null],[null,null,'wN',null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,'wB',null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,'wR',null,null,null,null,null,null]],turn:'w',sol:[[7,1,0,1]],label:'Rook to b8 wK Bf4 Nc6 all cover b8'},
{b:[['bK',null,null,null,null,null,null,null],['bP','bP','wK',null,null,null,null,null],[null,null,'wN',null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,'wB',null,null],[null,null,null,null,null,null,null,null],[null,'wR',null,null,null,null,null,null],[null,null,null,null,null,null,null,null]],turn:'w',sol:[[6,1,0,1]],label:'Rook to b8 wK Bf4 Nc6 all cover b8'},
{b:[['bK',null,null,null,null,null,null,null],['bP','bP','wK',null,null,null,null,null],[null,null,'wN',null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,'wB',null,null],[null,'wR',null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null]],turn:'w',sol:[[5,1,0,1]],label:'Rook to b8 wK Bf4 Nc6 all cover b8'},
{b:[['bK',null,null,null,null,null,null,null],['bP','bP','wK',null,null,null,null,null],[null,null,'wN',null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,'wR',null,null,null,'wB',null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null]],turn:'w',sol:[[4,1,0,1]],label:'Rook to b8 wK Bf4 Nc6 all cover b8'},
{b:[['bK',null,null,null,null,null,null,null],['bP','bP','wK',null,null,null,null,null],[null,null,'wN',null,null,null,null,null],[null,'wR',null,null,null,null,null,null],[null,null,null,null,null,'wB',null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null]],turn:'w',sol:[[3,1,0,1]],label:'Rook to b8 wK Bf4 Nc6 all cover b8'},
{b:[[null,null,null,null,null,null,null,'bK'],[null,null,null,null,null,'wK','bP','bP'],[null,null,null,null,null,'wN',null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,'wQ',null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,'wR',null,null]],turn:'w',sol:[[7,5,0,5]],label:'Rook to f8 wK Nf6 Queen all cover g8'},
{b:[['bK',null,null,null,null,null,null,null],['bP','bP','wK',null,null,null,null,null],[null,null,'wN',null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,'wQ',null],[null,null,null,null,null,null,null,null],[null,'wR',null,null,null,null,null,null]],turn:'w',sol:[[7,1,0,1]],label:'Rook to b8 wK Nc6 Queen all cover b8'},
{b:[[null,null,null,null,null,null,null,'bK'],[null,null,null,null,null,'wK','bP','bP'],[null,null,null,null,null,'wN',null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,'wQ',null,null,null,null,null,null],[null,null,null,null,null,'wR',null,null],[null,null,null,null,null,null,null,null]],turn:'w',sol:[[6,5,0,5]],label:'Rook to f8 wK Nf6 Queen all cover g8'},
{b:[['bK',null,null,null,null,null,null,null],['bP','bP','wK',null,null,null,null,null],[null,null,'wN',null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,'wQ',null],[null,'wR',null,null,null,null,null,null],[null,null,null,null,null,null,null,null]],turn:'w',sol:[[6,1,0,1]],label:'Rook to b8 wK Nc6 Queen all cover b8'},
{b:[[null,null,null,null,null,null,null,'bK'],[null,null,null,null,null,'wK','bP','bP'],[null,null,null,null,null,'wN',null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,'wQ',null,null,null,'wR',null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null]],turn:'w',sol:[[5,5,0,5]],label:'Rook to f8 wK Nf6 Queen all cover g8'},
{b:[['bK',null,null,null,null,null,null,null],['bP','bP','wK',null,null,null,null,null],[null,null,'wN',null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,'wR',null,null,null,null,'wQ',null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null]],turn:'w',sol:[[5,1,0,1]],label:'Rook to b8 wK Nc6 Queen all cover b8'},
{b:[[null,null,null,null,null,null,null,'bK'],[null,null,null,null,null,'wK','bP','bP'],[null,null,null,null,null,'wN',null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,'wR',null,null],[null,'wQ',null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null]],turn:'w',sol:[[4,5,0,5]],label:'Rook to f8 wK Nf6 Queen all cover g8'},
{b:[['bK',null,null,null,null,null,null,null],['bP','bP','wK',null,null,null,null,null],[null,null,'wN',null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,'wR',null,null,null,null,null,null],[null,null,null,null,null,null,'wQ',null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null]],turn:'w',sol:[[4,1,0,1]],label:'Rook to b8 wK Nc6 Queen all cover b8'},
{b:[[null,null,null,null,null,null,null,'bK'],[null,null,null,null,null,'wK','bP','bP'],[null,null,null,null,null,'wN',null,null],[null,null,null,null,null,'wR',null,null],[null,null,null,null,null,null,null,null],[null,'wQ',null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null]],turn:'w',sol:[[3,5,0,5]],label:'Rook to f8 wK Nf6 Queen all cover g8'},
{b:[['bK',null,null,null,null,null,null,null],['bP','bP','wK',null,null,null,null,null],[null,null,'wN',null,null,null,null,null],[null,'wR',null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,'wQ',null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null]],turn:'w',sol:[[3,1,0,1]],label:'Rook to b8 wK Nc6 Queen all cover b8'},
],
expert:
[
{b:[[null,null,null,null,null,null,null,'bK'],[null,null,null,null,null,'wK','bP','bP'],[null,null,null,null,null,'wN',null,null],[null,null,null,null,null,null,null,null],[null,null,'wB',null,null,null,null,null],[null,'wQ',null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,'wR',null,null]],turn:'w',sol:[[7,5,0,5]],label:'Rook to f8 maximum coverage on g8'},
{b:[[null,null,null,null,null,null,null,'bK'],[null,null,null,null,null,'wK','bP','bP'],[null,null,null,null,null,'wN',null,null],[null,null,null,null,null,null,null,null],[null,null,'wB',null,null,null,null,null],[null,'wQ',null,null,null,null,null,null],[null,null,null,null,null,'wR',null,null],[null,null,null,null,null,null,null,null]],turn:'w',sol:[[6,5,0,5]],label:'Rook to f8 maximum coverage on g8'},
{b:[[null,null,null,null,null,null,null,'bK'],[null,null,null,null,null,'wK','bP','bP'],[null,null,null,null,null,'wN',null,null],[null,null,null,null,null,null,null,null],[null,null,'wB',null,null,null,null,null],[null,'wQ',null,null,null,'wR',null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null]],turn:'w',sol:[[5,5,0,5]],label:'Rook to f8 maximum coverage on g8'},
{b:[[null,null,null,null,null,null,null,'bK'],[null,null,null,null,null,'wK','bP','bP'],[null,null,null,null,null,'wN',null,null],[null,null,null,null,null,null,null,null],[null,null,'wB',null,null,'wR',null,null],[null,'wQ',null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null]],turn:'w',sol:[[4,5,0,5]],label:'Rook to f8 maximum coverage on g8'},
{b:[[null,null,null,null,null,null,null,'bK'],[null,null,null,null,null,'wK','bP','bP'],[null,null,null,null,null,'wN',null,null],[null,null,null,null,null,'wR',null,null],[null,null,'wB',null,null,null,null,null],[null,'wQ',null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null]],turn:'w',sol:[[3,5,0,5]],label:'Rook to f8 maximum coverage on g8'},
{b:[['bK',null,null,null,null,null,null,null],['bP','bP','wK',null,null,null,null,null],[null,null,'wN',null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,'wB',null,null],[null,null,null,null,null,null,'wQ',null],[null,null,null,null,null,null,null,null],[null,'wR',null,null,null,null,null,null]],turn:'w',sol:[[7,1,0,1]],label:'Rook to b8 maximum coverage'},
{b:[['bK',null,null,null,null,null,null,null],['bP','bP','wK',null,null,null,null,null],[null,null,'wN',null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,'wB',null,null],[null,null,null,null,null,null,'wQ',null],[null,'wR',null,null,null,null,null,null],[null,null,null,null,null,null,null,null]],turn:'w',sol:[[6,1,0,1]],label:'Rook to b8 maximum coverage'},
{b:[['bK',null,null,null,null,null,null,null],['bP','bP','wK',null,null,null,null,null],[null,null,'wN',null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,'wB',null,null],[null,'wR',null,null,null,null,'wQ',null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null]],turn:'w',sol:[[5,1,0,1]],label:'Rook to b8 maximum coverage'},
{b:[['bK',null,null,null,null,null,null,null],['bP','bP','wK',null,null,null,null,null],[null,null,'wN',null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,'wR',null,null,null,'wB',null,null],[null,null,null,null,null,null,'wQ',null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null]],turn:'w',sol:[[4,1,0,1]],label:'Rook to b8 maximum coverage'},
{b:[['bK',null,null,null,null,null,null,null],['bP','bP','wK',null,null,null,null,null],[null,null,'wN',null,null,null,null,null],[null,'wR',null,null,null,null,null,null],[null,null,null,null,null,'wB',null,null],[null,null,null,null,null,null,'wQ',null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null]],turn:'w',sol:[[3,1,0,1]],label:'Rook to b8 maximum coverage'},
{b:[[null,null,null,null,null,null,null,'bK'],[null,null,null,null,null,'wK','bP','bP'],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,'wB',null,null,null,null,null],[null,'wQ',null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,'wR',null]],turn:'w',sol:[[7,6,0,6]],label:'Rook to g8 wK Bc4 Queen all cover'},
{b:[['bK',null,null,null,null,null,null,null],['bP','bP','wK',null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,'wB',null,null],[null,null,null,null,null,null,'wQ',null],[null,null,null,null,null,null,null,null],[null,'wR',null,null,null,null,null,null]],turn:'w',sol:[[7,1,0,1]],label:'Rook to b8 wK Bf4 Queen all cover b8'},
{b:[[null,null,null,null,null,null,null,'bK'],[null,null,null,null,null,'wK','bP','bP'],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,'wB',null,null,null,null,null],[null,'wQ',null,null,null,null,null,null],[null,null,null,null,null,null,'wR',null],[null,null,null,null,null,null,null,null]],turn:'w',sol:[[6,6,0,6]],label:'Rook to g8 wK Bc4 Queen all cover'},
{b:[['bK',null,null,null,null,null,null,null],['bP','bP','wK',null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,'wB',null,null],[null,null,null,null,null,null,'wQ',null],[null,'wR',null,null,null,null,null,null],[null,null,null,null,null,null,null,null]],turn:'w',sol:[[6,1,0,1]],label:'Rook to b8 wK Bf4 Queen all cover b8'},
{b:[[null,null,null,null,null,null,null,'bK'],[null,null,null,null,null,'wK','bP','bP'],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,'wB',null,null,null,null,null],[null,'wQ',null,null,null,null,'wR',null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null]],turn:'w',sol:[[5,6,0,6]],label:'Rook to g8 wK Bc4 Queen all cover'},
{b:[['bK',null,null,null,null,null,null,null],['bP','bP','wK',null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,'wB',null,null],[null,'wR',null,null,null,null,'wQ',null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null]],turn:'w',sol:[[5,1,0,1]],label:'Rook to b8 wK Bf4 Queen all cover b8'},
{b:[[null,null,null,null,null,null,null,'bK'],[null,null,null,null,null,'wK','bP','bP'],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,'wB',null,null,null,'wR',null],[null,'wQ',null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null]],turn:'w',sol:[[4,6,0,6]],label:'Rook to g8 wK Bc4 Queen all cover'},
{b:[['bK',null,null,null,null,null,null,null],['bP','bP','wK',null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,'wR',null,null,null,'wB',null,null],[null,null,null,null,null,null,'wQ',null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null]],turn:'w',sol:[[4,1,0,1]],label:'Rook to b8 wK Bf4 Queen all cover b8'},
{b:[[null,null,null,null,null,null,null,'bK'],[null,null,null,null,null,'wK','bP','bP'],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,'wR',null],[null,null,'wB',null,null,null,null,null],[null,'wQ',null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null]],turn:'w',sol:[[3,6,0,6]],label:'Rook to g8 wK Bc4 Queen all cover'},
{b:[['bK',null,null,null,null,null,null,null],['bP','bP','wK',null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,'wR',null,null,null,null,null,null],[null,null,null,null,null,'wB',null,null],[null,null,null,null,null,null,'wQ',null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null]],turn:'w',sol:[[3,1,0,1]],label:'Rook to b8 wK Bf4 Queen all cover b8'},
],
};
const DIFFS=['easy','medium','hard','extreme','expert'];
const DIFF_NAMES={easy:'Easy',medium:'Medium',hard:'Hard',extreme:'Extreme',expert:'Expert'};
const DIFF_ELO={easy:'~200 ELO',medium:'~400 ELO',hard:'~600 ELO',extreme:'~800 ELO',expert:'~1000 ELO'};

function loadPuzzleProgress(){
  var def={easy:{done:[],cooldownUntil:0},medium:{done:[],cooldownUntil:0},hard:{done:[],cooldownUntil:0},extreme:{done:[],cooldownUntil:0},expert:{done:[],cooldownUntil:0}};
  try{
    var p=JSON.parse(localStorage.getItem('chessP')||'{}');
    // Ensure all difficulty keys exist (handles old saved data missing new keys)
    DIFFS.forEach(function(d){if(!p[d])p[d]={done:[],cooldownUntil:0};if(!p[d].done)p[d].done=[];if(!p[d].cooldownUntil)p[d].cooldownUntil=0;});
    return p;
  }catch(e){return def;}
}
function savePuzzleProgress(p){try{localStorage.setItem('chessP',JSON.stringify(p));}catch(e){}}

function isDiffUnlocked(diff){
  const idx=DIFFS.indexOf(diff);
  if(idx===0)return true;
  const prev=DIFFS[idx-1];
  const prog=loadPuzzleProgress();
  return prog[prev].done.length>=20;
}

function isLevelUnlocked(diff,lvl){
  if(lvl===0)return true;
  const prog=loadPuzzleProgress();
  return prog[diff].done.includes(lvl-1);
}

function hasCooldown(diff){
  const prog=loadPuzzleProgress();
  return prog[diff].cooldownUntil>Date.now();
}

function getCooldownMs(diff){
  const prog=loadPuzzleProgress();
  return Math.max(0,prog[diff].cooldownUntil-Date.now());
}

function setCooldown(diff){
  const prog=loadPuzzleProgress();
  prog[diff].cooldownUntil=Date.now()+5*60*1000; // 5 minutes
  savePuzzleProgress(prog);
}

function markDone(diff,lvl){
  const prog=loadPuzzleProgress();
  if(!prog[diff].done.includes(lvl))prog[diff].done.push(lvl);
  savePuzzleProgress(prog);
  setTimeout(checkQuestProgress,200);
}

let PZ={diff:null,lvl:null,board:null,turn:null,sol:null,step:0,sel:null,moves:[],solved:false,showing:false};
let cdInterval=null;

function openPuzzleHome(){
  showScreen('sPuzzleHome');
  updateDiffCards();
}

function updateDiffCards(){
  const prog=loadPuzzleProgress();
  DIFFS.forEach(d=>{
    const card=document.querySelector(`.diff-card[data-diff="${d}"]`);
    if(!card)return;
    const done=prog[d].done.length;
    document.getElementById('prog-'+d).textContent=done+' / 20';
    // Show ELO under name
    let eloEl=card.querySelector('.diff-elo');
    if(!eloEl){
      eloEl=document.createElement('div');
      eloEl.className='diff-elo';
      eloEl.style.cssText='font-size:10px;color:#f0c040;font-weight:600;margin-top:2px;';
      const h3=card.querySelector('h3');
      if(h3)h3.insertAdjacentElement('afterend',eloEl);
    }
    eloEl.textContent=DIFF_ELO[d]||'';
    const lockEl=document.getElementById('lock-'+d);
    if(isDiffUnlocked(d)){
      card.classList.remove('locked');card.classList.add('unlocked');
      if(lockEl)lockEl.style.display='none';
    } else {
      card.classList.add('locked');card.classList.remove('unlocked');
      if(lockEl)lockEl.style.display='';
    }
  });
}

function openLevelSelect(diff){
  if(!isDiffUnlocked(diff)){return;}
  if(hasCooldown(diff)){showCooldown(diff);return;}
  PZ.diff=diff;
  document.getElementById('pzlLvlTitle').textContent=DIFF_NAMES[diff]+' Puzzles';
  const prog=loadPuzzleProgress();
  const done=prog[diff].done;
  const grid=document.getElementById('levelGrid');
  grid.innerHTML='';
  // Find exactly ONE "next" level — lowest incomplete where previous is done (or level 0)
  let nextLvl=-1;
  for(let i=0;i<20;i++){
    if(!done.includes(i)&&(i===0||done.includes(i-1))){nextLvl=i;break;}
  }
  for(let i=0;i<20;i++){
    const b=document.createElement('div');
    const isDone=done.includes(i);
    const isNext=i===nextLvl;
    const isLocked=!isDone&&!isNext&&(i!==0&&!done.includes(i-1));
    b.className='lvl-btn'+(isDone?' done':isNext?' current':isLocked?' locked':'');
    b.innerHTML=`<span>${i+1}</span><span class="lvl-star">${isDone?'✓':isLocked?'🔒':''}</span>`;
    if(!isLocked){
      const idx=i;
      b.addEventListener('click',()=>startPuzzle(diff,idx));
      b.addEventListener('touchstart',e=>{e.preventDefault();startPuzzle(diff,idx);},{passive:false});
    }
    grid.appendChild(b);
  }
  showScreen('sPuzzleLevels');
}

function startPuzzle(diff,lvl,isDaily){
  if(!isDaily&&hasCooldown(diff)){showCooldown(diff);return;}
  const pz=PUZZLES[diff][lvl];
  PZ={diff,lvl,board:pz.b.map(r=>r.slice()),turn:pz.turn,sol:pz.sol,step:0,sel:null,moves:[],solved:false,showing:false,isDaily:!!isDaily};
  document.getElementById('pzlPlayTitle').textContent=DIFF_NAMES[diff]+' · '+(isDaily?'Daily Puzzle':'Level '+(lvl+1));
  document.getElementById('pzlPlaySub').textContent=pz.label+' — '+(pz.turn==='w'?'White':'Black')+' to move';
  document.getElementById('pzlMsg').textContent='Tap a piece to start';
  document.getElementById('pzlMsg').className='pzl-msg info';
  showScreen('sPuzzlePlay');
  renderPuzzleBoard();
}

function renderPuzzleBoard(){
  const bEl=document.getElementById('pzlBoard');
  bEl.style.cssText='display:grid;grid-template-columns:repeat(8,1fr);grid-template-rows:repeat(8,1fr);width:min(calc(100vw - 8px),calc(100dvh - 100px));height:min(calc(100vw - 8px),calc(100dvh - 100px));max-width:520px;max-height:520px;border:3px solid #333;border-radius:4px;overflow:hidden;box-shadow:0 6px 28px rgba(0,0,0,.5);aspect-ratio:1/1;flex-shrink:0;';
  bEl.innerHTML='';
  const F='abcdefgh',R='87654321';
  for(let r=0;r<8;r++){
    for(let f=0;f<8;f++){
      const sq=document.createElement('div');
      sq.style.cssText='position:relative;display:flex;align-items:center;justify-content:center;-webkit-user-select:none;user-select:none;';
      sq.style.background=((r+f)%2===0)?getComputedStyle(document.documentElement).getPropertyValue('--ls').trim()||'#f0d9b5':getComputedStyle(document.documentElement).getPropertyValue('--ds').trim()||'#779556';
      sq.dataset.r=r;sq.dataset.f=f;
      if(PZ.sel&&PZ.sel[0]===r&&PZ.sel[1]===f)sq.style.background='rgba(20,85,30,.55)';
      if(PZ.moves.some(m=>m.r===r&&m.f===f)){
        const dot=document.createElement('div');
        if(PZ.board[r][f]){dot.style.cssText='position:absolute;inset:0;border:5px solid rgba(0,0,0,.25);border-radius:50%;pointer-events:none;z-index:1;';}
        else{dot.style.cssText='position:absolute;width:33%;height:33%;border-radius:50%;background:rgba(0,0,0,.22);pointer-events:none;z-index:1;';}
        sq.appendChild(dot);
      }
      if(PZ.board[r][f]){
        const pd=document.createElement('div');
        pd.style.cssText='width:92%;height:92%;position:relative;z-index:2;pointer-events:none;display:flex;align-items:center;justify-content:center;';
        pd.innerHTML=pieceSVG(PZ.board[r][f]);
        sq.appendChild(pd);
      }
      if(f===7){const l=document.createElement('div');l.style.cssText='position:absolute;bottom:1px;right:2px;font-size:8px;font-weight:700;opacity:.6;pointer-events:none;z-index:3;';l.textContent=R[r];sq.appendChild(l);}
      if(r===7){const l=document.createElement('div');l.style.cssText='position:absolute;bottom:1px;left:2px;font-size:8px;font-weight:700;opacity:.6;pointer-events:none;z-index:3;';l.textContent=F[f];sq.appendChild(l);}
      sq.addEventListener('touchstart',e=>{e.preventDefault();pzlTap(r,f);},{passive:false});
      sq.addEventListener('click',()=>pzlTap(r,f));
      bEl.appendChild(sq);
    }
  }
}

function pzlTap(r,f){
  if(PZ.solved||PZ.showing)return;
  const p=PZ.board[r][f];

  if(!PZ.sel){
    if(p&&CC(p)===PZ.turn){
      PZ.sel=[r,f];
      PZ.moves=legal(PZ.board,r,f,null,{wK:true,wKR:true,wQR:true,bK:true,bKR:true,bQR:true});
      const exp=PZ.sol[PZ.step];
      if(r===exp[0]&&f===exp[1]){
        const alreadyThere=PZ.moves.some(m=>m.r===exp[2]&&m.f===exp[3]);
        if(!alreadyThere) PZ.moves.push({r:exp[2],f:exp[3]});
      }
    }
    renderPuzzleBoard();
    return;
  }

  const[sr,sf]=PZ.sel;
  const expected=PZ.sol[PZ.step];

  if(sr===expected[0]&&sf===expected[1]&&r===expected[2]&&f===expected[3]){
    const cas={wK:true,wKR:true,wQR:true,bK:true,bKR:true,bQR:true};
    const promo=TT(PZ.board[sr][sf])==='P'&&r===0?'Q':undefined;
    const{nb}=applyB(PZ.board,sr,sf,r,f,{},cas,promo);
    PZ.board=nb;
    PZ.step++;
    PZ.sel=null;
    PZ.moves=[];
    playSound('move');
    if(PZ.step>=PZ.sol.length){
      PZ.solved=true;
      document.getElementById('pzlMsg').textContent='✅ Correct! Puzzle Solved!';
      document.getElementById('pzlMsg').className='pzl-msg ok';
      vibrate([80,40,200]);
      renderPuzzleBoard();
      if(PZ.isDaily){
        markDailyDone();
        setTimeout(()=>{showScreen('sHome');},1500);
      } else {
        markDone(PZ.diff,PZ.lvl);
        setTimeout(()=>{
          const next=PZ.lvl+1;
          if(next<20){startPuzzle(PZ.diff,next);}
          else{openLevelSelect(PZ.diff);}
        },1500);
      }
    } else {
      document.getElementById('pzlMsg').textContent='✓ Good! Keep going…';
      document.getElementById('pzlMsg').className='pzl-msg ok';
      renderPuzzleBoard();
    }
    return;
  }

  if(PZ.moves.some(m=>m.r===r&&m.f===f)){
    PZ.sel=null;PZ.moves=[];
    document.getElementById('pzlMsg').textContent='✗ Wrong move — try again';
    document.getElementById('pzlMsg').className='pzl-msg err';
    playSound('move');
    vibrate([80,40,80]);
    renderPuzzleBoard();
    return;
  }

  if(p&&CC(p)===PZ.turn&&!(r===sr&&f===sf)){
    PZ.sel=[r,f];
    PZ.moves=legal(PZ.board,r,f,null,{wK:true,wKR:true,wQR:true,bK:true,bKR:true,bQR:true});
    const exp=PZ.sol[PZ.step];
    if(r===exp[0]&&f===exp[1]){
      const alreadyThere=PZ.moves.some(m=>m.r===exp[2]&&m.f===exp[3]);
      if(!alreadyThere) PZ.moves.push({r:exp[2],f:exp[3]});
    }
    renderPuzzleBoard();
  } else {
    PZ.sel=null;PZ.moves=[];renderPuzzleBoard();
  }
}

function showPuzzleAnswer(){
  if(PZ.solved)return;
  PZ.showing=true;
  document.getElementById('pzlMsg').textContent='👁 Showing answer — puzzle will be skipped';
  document.getElementById('pzlMsg').className='pzl-msg err';
  document.getElementById('pzlHintBtn').style.opacity='0.4';
  // Mark this puzzle as done (skipped via answer)
  if(!PZ.isDaily) markDone(PZ.diff,PZ.lvl);
  else markDailyDone();
  PZ.solved=true;
  // Reset board to start position then animate solution
  PZ.board=PUZZLES[PZ.diff][PZ.lvl].b.map(r=>r.slice());
  PZ.sel=null;PZ.moves=[];
  renderPuzzleBoard();
  let step=0;
  const _isDaily=PZ.isDaily;
  function doStep(){
    if(step>=PZ.sol.length){
      if(_isDaily){
        document.getElementById('pzlMsg').textContent='✅ Solution shown — returning home…';
        document.getElementById('pzlMsg').className='pzl-msg ok';
        setTimeout(()=>{showScreen('sHome');},1500);
      } else {
        document.getElementById('pzlMsg').textContent='✅ Solution shown — moving to next puzzle…';
        document.getElementById('pzlMsg').className='pzl-msg ok';
        setTimeout(()=>{
          const next=PZ.lvl+1;
          if(next<20){startPuzzle(PZ.diff,next);}
          else{openLevelSelect(PZ.diff);}
        },1500);
      }
      return;
    }
    const[sr,sf,tr,tf]=PZ.sol[step];
    const promo=TT(PZ.board[sr][sf])==='P'&&tr===0?'Q':undefined;
    const{nb}=applyB(PZ.board,sr,sf,tr,tf,{},{wK:true,wKR:true,wQR:true,bK:true,bKR:true,bQR:true},promo);
    PZ.board=nb;step++;
    playSound('move');
    renderPuzzleBoard();
    setTimeout(doStep,900);
  }
  setTimeout(doStep,600);
}

function resetPuzzle(){
  PZ.board=PUZZLES[PZ.diff][PZ.lvl].b.map(r=>r.slice());
  PZ.step=0;PZ.sel=null;PZ.moves=[];PZ.solved=false;PZ.showing=false;
  document.getElementById('pzlMsg').textContent='Tap a piece to start';
  document.getElementById('pzlMsg').className='pzl-msg info';
  document.getElementById('pzlHintBtn').style.opacity='1';
  renderPuzzleBoard();
}

function showCooldown(diff){
  document.getElementById('cooldownOverlay').classList.add('show');
  if(cdInterval)clearInterval(cdInterval);
  function updCd(){
    const ms=getCooldownMs(diff);
    if(ms<=0){clearInterval(cdInterval);document.getElementById('cdTimer').textContent='0:00:00';return;}
    const h=Math.floor(ms/3600000),m=Math.floor((ms%3600000)/60000),s=Math.floor((ms%60000)/1000);
    document.getElementById('cdTimer').textContent=`${h}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  }
  updCd();
  cdInterval=setInterval(updCd,1000);
}

btn('puzzleBtn',openPuzzleHome);
btn('pzlHomeBack',()=>showScreen('sHome'));

btn('pzlLvlBack',()=>openPuzzleHome());
btn('pzlHintBtn',()=>{
  showConfirm('Show Answer?','The answer will play automatically and this puzzle will be skipped. A 5-minute cooldown will apply before solving the next one.','Show Answer',showPuzzleAnswer);
});
btn('pzlRetryBtn',()=>{if(!hasCooldown(PZ.diff))resetPuzzle();else showCooldown(PZ.diff);});
btn('pzlExitBtn',()=>openLevelSelect(PZ.diff));
btn('cdBackBtn',()=>{document.getElementById('cooldownOverlay').classList.remove('show');if(cdInterval)clearInterval(cdInterval);showScreen('sHome');});
document.getElementById('diffGrid').addEventListener('click',e=>{const card=e.target.closest('.diff-card');if(!card)return;openLevelSelect(card.dataset.diff);});
document.getElementById('diffGrid').addEventListener('touchstart',e=>{const card=e.target.closest('.diff-card');if(!card)return;e.preventDefault();openLevelSelect(card.dataset.diff);},{passive:false});
