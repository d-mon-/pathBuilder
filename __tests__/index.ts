import pathBuilder from '../src';

test('pathBuilder empty', () => {
  expect(pathBuilder.parse('')).toEqual([]);
  expect(pathBuilder.parse('   ')).toEqual([]);
  expect(pathBuilder.parse(' . . . ')).toEqual([]); 
  expect(pathBuilder.parse(' [] . [   ] ')).toEqual([]);
});

test('pathBuilder basic number', () => {
  expect(pathBuilder.parse('0.1.2.3')).toEqual([0,1,2,3]);
  expect(pathBuilder.parse('[0][1][2][3]')).toEqual([0,1,2,3]);
});

test('pathBuilder basic number with quote', () => {
  expect(pathBuilder.parse('1[2][\'3\'].\'4\'')).toEqual([1,2,"3", "'4'"]);
});

test('pathBuilder basic string', () => {
  expect(pathBuilder.parse('aaa.bbb')).toEqual(['aaa','bbb']);
  expect(pathBuilder.parse('"aaa".bbb')).toEqual(['"aaa"','bbb']);
  expect(pathBuilder.parse('aaa[bbb]')).toEqual(['aaa','bbb']);
  expect(pathBuilder.parse('aaa[bbb].ccc')).toEqual(['aaa','bbb','ccc']);
});

test('pathBuilder with escape', () => {
  expect(pathBuilder.parse('1\\[2\\][3]')).toEqual(['1[2]',3]);
  expect(pathBuilder.parse('1\\\\["2"\\\\]')).toEqual(["1\\",'"2"\\']);
  expect(pathBuilder.parse('1["2\\""]')).toEqual([1,'2"']);
  expect(pathBuilder.parse('aaa[\\"bbb\\"]')).toEqual(['aaa','"bbb"']);
  expect(pathBuilder.parse('aaa[\\]]')).toEqual(['aaa',']']);
});

test('pathBuilder with spaces', () => {
  expect(pathBuilder.parse('    aaa    .   bbb   ')).toEqual(['aaa','bbb']);
  expect(pathBuilder.parse('    aaa    [   bbb   ]    ')).toEqual(['aaa','bbb']);
  expect(pathBuilder.parse('  \n\t\r  aaa   [ \n\t\r  bbb   ]    ')).toEqual(['aaa','bbb']);
  expect(pathBuilder.parse('  a\n\t\raaa   [ b\n\t\rbbb   ]    ')).toEqual(['a\n\t\raaa','b\n\t\rbbb']);
})

test('pathBuilder with spaces and quotes', () => {
  expect(pathBuilder.parse('    aaa    [   "   bbb   "   ]    [    \'  ccc\'     ]'))
  .toEqual(['aaa','   bbb   ','  ccc']);
  expect(pathBuilder.parse('aaa["bbb"ccc]')).toEqual(['aaa','"bbb"ccc']);
  expect(pathBuilder.parse('aaa["bbb"  ccc]')).toEqual(['aaa','"bbb"  ccc']);
  expect(pathBuilder.parse('aaa["bbb]ccc')).toEqual(['aaa','bbb]ccc']);
  expect(pathBuilder.parse('  \n\t\r  aaa   [ \n\t\r"bbb" \n\t\r  ]    ')).toEqual(['aaa','bbb']);
  expect(pathBuilder.parse('  \n\t\r  aaa   [ \n\t\r"\n\t\rbbb"\n\t\r   ]    ')).toEqual(['aaa','\n\t\rbbb']);
})

test('pathBuilder with leading zero', () => {
  expect(pathBuilder.parse('01.2.03')).toEqual(['01',2,'03']);
});

test('pathBuilder supported cases', () => {
  expect(pathBuilder.parse(' [  ')).toEqual([]);
  expect(pathBuilder.parse('aaa[bbb]ccc')).toEqual(['aaa','bbb', 'ccc']);
  expect(pathBuilder.parse('aaa.[bbb]')).toEqual(['aaa','bbb']);
  expect(pathBuilder.parse('aaa...[bbb]...')).toEqual(['aaa','bbb']);
  expect(pathBuilder.parse('aaa[][][bbb][]')).toEqual(['aaa','bbb']); 
  expect(pathBuilder.parse('aaa[]]]')).toEqual(['aaa',']]']); 
  expect(pathBuilder.parse('[aaa][bbb]')).toEqual(['aaa','bbb']); 
});

