export type Path = (number | string)[];

// 01, +1, -1, 1.0, etc... : are described as invalid index to avoid loosing information during parseInt
const REGEX_IDX = /^(0|[1-9]\d?)$/;
const REGEX_TRIM = /^\s+$/;

function basicExitCondition(char: string) {
    return char === '.' || char === '[';
}

function bracketExitCondition(char: string) {
    return char === ']';
}

export default class PathBuilder {
    _path: string = '';
    _char: string = undefined;
    _index: number = 0;

    nextChar() {
        this._index += 1;
        this._char = this._path[this._index];
        return this._char;
    }

    compute(path: string): Path {
        this._path = path;
        this._index = 0;
        this._char = path[0];
        const result: Path = [];

        while (!this.charIsUndefined()) {
            if (this._char === '[') {
                const crumb = this.extractBracketCrumb();
                PathBuilder.pushCrumb(result, crumb);
            } else if (this._char === '.') {
                this.nextChar();
            } else {
                const crumb = this.extractBasicCrumb(basicExitCondition);
                PathBuilder.pushCrumb(result, crumb.trim());
            }
        }

        return result;
    }

    static pushCrumb(result: Path, crumb: string){
        if (crumb === '') return;

        const key = REGEX_IDX.test(crumb) ? parseInt(crumb) : crumb;
        result.push(key);
    }

    charIsUndefined() {
        return typeof this._char === 'undefined';
    }

    extractBasicCrumb(exitCondition: (c: string) => boolean) {
        let crumb = '';
        while(!exitCondition(this._char)) {
            if (this._char === '\\') { // ESCAPE
                this.nextChar();
            }
            if(this.charIsUndefined()) {
                break;
            }
            crumb += this._char;
            this.nextChar();
        }
        return crumb;
    }

    extractBracketCrumb() {
        let crumb = '';

        this.nextChar(); // skip '['
        while (REGEX_TRIM.test(this._char)) { // manual trim
            this.nextChar();
        }
        if (this.charIsUndefined()) {
            return crumb;
        } 

        let quote = null;
        if (this._char === '"' || this._char === '\'') {
            quote = this._char;
            this.nextChar();
            crumb = this.extractBasicCrumb((value: string) => value === quote);
            if (this._char === quote) {
                this.nextChar();
            }
        } 
        
        const previousValue = crumb;
        crumb = this.extractBasicCrumb(bracketExitCondition); // check for values between quote and bracket

        if (crumb === '' || REGEX_TRIM.test(crumb)) {
            crumb = previousValue;
        } else {
            const value = quote ? quote + previousValue + quote + crumb : crumb;
            crumb = value.trim();
        }
            
        this.nextChar();  // skip ']'
        return crumb;
    } 
}
