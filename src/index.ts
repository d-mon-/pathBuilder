import PathBuilder, {Path} from './pathBuilder';

function isPlainObject(value: any) {
    return typeof value === "object" && value !== null;
}

function browseTree(tree: object, path: (number|string)[]) {
    let value:any = tree;
    for(let i = 0, l = path.length; i < l; i++) {
        const nextKey = path[i];
        value = value[nextKey];
        if (i < l - 1 && !isPlainObject(value)) { // stop if you can't go deeper
            return [false, undefined];
        }
    }
    return [true, value];
}

const memoizer = new Map<string, Path>();
const pathBuilderSingleton = new PathBuilder();
function extractPath(path: string | Path): Path {
    if (typeof path === 'string') {
        const memoizeredValue = memoizer.get(path);
        if (memoizeredValue) {
            return memoizeredValue;
        }
        
        const pathAsArray = pathBuilderSingleton.compute(path);
        memoizer.set(path, pathAsArray);
        return pathAsArray;
    }

    return Array.isArray(path) ? path : null; // do not memoize array to avoid possible memory leak
}

class PathMap {
    _values: object;

    constructor(obj:object = {}) {
        this._values = obj;
    }

    get values() {
        return this._values;
    }

    set values (values: object) {
        this._values = values;
    }

    getValue(path: string): any {
        const breadcrumbs = extractPath(path);
        return browseTree(this.values, breadcrumbs)[1];
    }

    setValue(path: string | (number|string)[], nextValue: any) {
        const breadcrumbs = extractPath(path);
        const [defined, previousValue] = browseTree(this.values, breadcrumbs);

        if (!defined || previousValue !== nextValue) {
            this.values = {...this.values}; // Immutable

            for(let i = 0, l = breadcrumbs.length, position = this.values; i < l; i++) {
                const crumb = breadcrumbs[i];
                if (i < l - 1) {
                    const nextPosition = position[crumb];
                    // TODO check if number to add/update an array
                    const newObject = isPlainObject(nextPosition) ? {...nextPosition} : {};
        
                    position[crumb] = newObject;
                    position = newObject; // go deeper
                } else { // last element of the path
                    position[crumb] = nextValue;
                }
            }
        }
    }

    deleteValue(path: string, indexes?: number|number[], lastIndex?: number) { // splice on array ???
        const breadcrumbs = extractPath(path);
        const lastCrumb = breadcrumbs.pop();
        const [defined, value] = browseTree(this.values, breadcrumbs);

        if (defined && typeof value === 'object' && value.hasOwnProperty(lastCrumb)) {
            const previousValue = value[lastCrumb];
            let nextValue = [...previousValue];
            if (Array.isArray(previousValue)) {
                if (typeof indexes === 'number' && typeof lastIndex === 'number') {
                    nextValue.splice(indexes, lastIndex);
                } 
            }
        }
    }
}

export default PathMap;