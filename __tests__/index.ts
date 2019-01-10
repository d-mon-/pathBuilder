import PathMap from '../src/index';

test.skip('path mapper GET value', () => {
    const map = new PathMap();
    map.setValue('a.b', 4);
    expect(map.getValue('a.b')).toBe(4);

    map.setValue('a.c.d', 4);
    expect(map.getValue('a.c.d')).toBe(4);
    
    expect(map.getValue('q')).toBe(undefined);
});

test.skip('path mapper SET value', () => {
    const map = new PathMap();
    map.setValue('a.b', 4);
    expect(map.values).toEqual({a:{b: 4}});

    map.setValue('a.c', 4);
    expect(map.values).toEqual({a:{b: 4, c:4}});

    map.setValue('a.c.d', 4);
    expect(map.values).toEqual({a:{b: 4, c:{d :4}}});
});