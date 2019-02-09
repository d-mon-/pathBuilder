export type Path = (number | string)[];

// 01, +1, -1, 1.0, etc... : are described as invalid index to avoid loosing information during parseInt
const REGEX_IDX = /^(0|[1-9]\d?)$/;
const REGEX_TRIM = /^\s*$/;

function basicExitCondition(char: string | void) {
    return char !== '.' && char !== '[';
}

function bracketExitCondition(char: string | void) {
    return char !== ']';
}

class PathBuilder {
    _path: string;
    _char: string | void;
    _index: number;
    _result: Path;

    constructor(path: string) {
        this._path = path;
        this._index = 0;
        this._char = path[0];
        this._result = [];
    }

    nextChar() {
        this._index += 1;
        this._char = this._path[this._index];
        return this._char;
    }

    parse(): Path {
        while (this._char) {
            if (this._char === '[') {
                this.extractBracketCrumb();
            } else if (this._char === '.') {
                this.nextChar();
            } else {
                this.extractBasicCrumb();
            }
        }

        return this._result;
    }

    pushCrumb(crumb: string, quoted: boolean){
        if (crumb === '') return;

        const key = !quoted && REGEX_IDX.test(crumb) ? parseInt(crumb) : crumb;
        this._result.push(key);
    }

    extractCrumb(exitCondition: (c: string | void) => boolean) {
        let crumb = '';
        while(exitCondition(this._char)) {
            if (this._char === '\\') { // ESCAPE
                this.nextChar();
            }
            if(!this._char) {
                break;
            }
            crumb += this._char;
            this.nextChar();
        }
        return crumb;
    }

    extractBasicCrumb() {
        const crumb = this.extractCrumb(basicExitCondition);
        this.pushCrumb(crumb.trim(), false);
    }

    extractBracketCrumb() {
        let crumb = '';

        this.nextChar(); // skip '['
        while (this._char && REGEX_TRIM.test(this._char)) { // manual trim
            this.nextChar();
        }

        let quote: string | null= null;
        if (this._char === '"' || this._char === '\'') {
            quote = this._char;
            this.nextChar();
            crumb = this.extractCrumb((value: string | void) => value !== quote);
            if (this._char === quote) {
                this.nextChar();
            }
        } 
        
        const nextCrumb = this.extractCrumb(bracketExitCondition); // check for values between quote and closing bracket
        if (!REGEX_TRIM.test(nextCrumb)) {
            const value = quote ? quote + crumb + quote + nextCrumb : nextCrumb;
            crumb = value.trim();
        }
            
        this.nextChar();  // skip ']'
        this.pushCrumb(crumb, !!quote);
    } 
}

const stringToPath = {
    parse: function parse(value: string) {
        if (typeof value !== 'string') {
            throw new Error('stringToPath.parse requires a string');
        }
        const pathBuilder = new PathBuilder(value);
        return pathBuilder.parse();
    }
}
export default stringToPath;