import PathBuilder from '../src/pathBuilder';

const pathBuilder = new PathBuilder();
test('pathBuilder empty', () => {
  expect(pathBuilder.compute('')).toEqual([]);
  expect(pathBuilder.compute('   ')).toEqual([]);
  expect(pathBuilder.compute(' . . . ')).toEqual([]); 
  expect(pathBuilder.compute(' [] . [   ] ')).toEqual([]);
});

test('pathBuilder basic number', () => {
  expect(pathBuilder.compute('1.2.3')).toEqual([1,2,3]);
  expect(pathBuilder.compute('1[2][3]')).toEqual([1,2,3]);
});

test('pathBuilder basic string', () => {
  expect(pathBuilder.compute('aaa.bbb')).toEqual(['aaa','bbb']);
  expect(pathBuilder.compute('"aaa".bbb')).toEqual(['"aaa"','bbb']);
  expect(pathBuilder.compute('aaa[bbb]')).toEqual(['aaa','bbb']);
  expect(pathBuilder.compute('aaa[bbb].ccc')).toEqual(['aaa','bbb','ccc']);
});

test('pathBuilder with escape', () => {
  expect(pathBuilder.compute('1\\[2\\][3]')).toEqual(['1[2]',3]);
  expect(pathBuilder.compute('1\\\\["2"\\\\]')).toEqual(["1\\",'"2"\\']);
  expect(pathBuilder.compute('1["2\\""]')).toEqual([1,'2"']);
  expect(pathBuilder.compute('aaa[\\"bbb\\"]')).toEqual(['aaa','"bbb"']);
  expect(pathBuilder.compute('aaa[\\]]')).toEqual(['aaa',']']);
});

test('pathBuilder with spaces', () => {
  expect(pathBuilder.compute('    aaa    .   bbb   ')).toEqual(['aaa','bbb']);
  expect(pathBuilder.compute('    aaa    [   bbb   ]    ')).toEqual(['aaa','bbb']);
  expect(pathBuilder.compute('  \n\t\r  aaa   [ \n\t\r  bbb   ]    ')).toEqual(['aaa','bbb']);
  expect(pathBuilder.compute('  a\n\t\raaa   [ b\n\t\rbbb   ]    ')).toEqual(['a\n\t\raaa','b\n\t\rbbb']);
})

test('pathBuilder with spaces and quotes', () => {
  expect(pathBuilder.compute('    aaa    [   "   bbb   "   ]    [    \'  ccc\'     ]'))
  .toEqual(['aaa','   bbb   ','  ccc']);
  expect(pathBuilder.compute('aaa["bbb"ccc]')).toEqual(['aaa','"bbb"ccc']);
  expect(pathBuilder.compute('aaa["bbb"  ccc]')).toEqual(['aaa','"bbb"  ccc']);
  expect(pathBuilder.compute('aaa["bbb]ccc')).toEqual(['aaa','bbb]ccc']);
  expect(pathBuilder.compute('  \n\t\r  aaa   [ \n\t\r"bbb" \n\t\r  ]    ')).toEqual(['aaa','bbb']);
  expect(pathBuilder.compute('  \n\t\r  aaa   [ \n\t\r"\n\t\rbbb"\n\t\r   ]    ')).toEqual(['aaa','\n\t\rbbb']);
})

test('pathBuilder with leading zero', () => {
  expect(pathBuilder.compute('01.2.03')).toEqual(['01',2,'03']);
});

test('pathBuilder supported cases', () => {
  expect(pathBuilder.compute(' [  ')).toEqual([]);
  expect(pathBuilder.compute('aaa[bbb]ccc')).toEqual(['aaa','bbb', 'ccc']);
  expect(pathBuilder.compute('aaa.[bbb]')).toEqual(['aaa','bbb']);
  expect(pathBuilder.compute('aaa...[bbb]...')).toEqual(['aaa','bbb']);
  expect(pathBuilder.compute('aaa[][][bbb][]')).toEqual(['aaa','bbb']); 
  expect(pathBuilder.compute('aaa[]]]')).toEqual(['aaa',']]']); 
});

