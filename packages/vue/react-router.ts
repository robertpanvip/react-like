
import {useRoute} from 'vue-router';

type RegexMatchPlus<CharPattern extends string, T extends string> = T extends `${infer First}${infer Rest}` ? First extends CharPattern ? RegexMatchPlus<CharPattern, Rest> extends never ? First : `${First}${RegexMatchPlus<CharPattern, Rest>}` : never : never;
type Regex_az =
    "a"
    | "b"
    | "c"
    | "d"
    | "e"
    | "f"
    | "g"
    | "h"
    | "i"
    | "j"
    | "k"
    | "l"
    | "m"
    | "n"
    | "o"
    | "p"
    | "q"
    | "r"
    | "s"
    | "t"
    | "u"
    | "v"
    | "w"
    | "x"
    | "y"
    | "z";
type Regez_AZ =
    "A"
    | "B"
    | "C"
    | "D"
    | "E"
    | "F"
    | "G"
    | "H"
    | "I"
    | "J"
    | "K"
    | "L"
    | "M"
    | "N"
    | "O"
    | "P"
    | "Q"
    | "R"
    | "S"
    | "T"
    | "U"
    | "V"
    | "W"
    | "X"
    | "Y"
    | "Z";
type Regex_09 = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";
type Regex_w = Regex_az | Regez_AZ | Regex_09 | "_";
type ParamChar = Regex_w | "-";
type _PathParam<Path extends string> = Path extends `${infer L}/${infer R}` ? _PathParam<L> | _PathParam<R> : Path extends `:${infer Param}` ? Param extends `${infer Optional}?${string}` ? RegexMatchPlus<ParamChar, Optional> : RegexMatchPlus<ParamChar, Param> : never;
type PathParam<Path extends string> = Path extends "*" | "/*" ? "*" : Path extends `${infer Rest}/*` ? "*" | _PathParam<Rest> : _PathParam<Path>;
type ParamParseKey<Segment extends string> = [
    PathParam<Segment>
] extends [never] ? string : PathParam<Segment>;

type AgnosticRouteMatch = object

export interface RouteMatch extends AgnosticRouteMatch {
}

interface PathPattern<Path extends string = string> {
    path: Path;
    caseSensitive?: boolean;
    end?: boolean;
}

type Params<Key extends string = string> = {
    [key in Key]: string | undefined;
};

interface PathMatch<ParamKey extends string = string> {
    /**
     * The names and values of dynamic parameters in the URL.
     */
    params: Params<ParamKey>;
    /**
     * The portion of the URL pathname that was matched.
     */
    pathname: string;
    /**
     * The portion of the URL pathname that was matched before child routes.
     */
    pathnameBase: string;
    /**
     * The pattern that was used to match.
     */
    pattern: PathPattern;
}

export function matchPath<ParamKey extends ParamParseKey<Path>, Path extends string>(pattern: PathPattern<Path> | Path, pathname: string): PathMatch<ParamKey> | null {
    if (typeof pattern === "string") {
        pattern = {path: pattern, caseSensitive: false, end: true};
    }
    let [matcher, compiledParams] = compilePath(
        pattern.path,
        pattern.caseSensitive,
        pattern.end
    );
    let match = pathname.match(matcher);
    if (!match) return null;
    let matchedPathname = match[0];
    let pathnameBase = matchedPathname.replace(/(.)\/+$/, "$1");
    let captureGroups = match.slice(1);
    let params = compiledParams.reduce(
        (memo2, {paramName, isOptional}, index) => {
            if (paramName === "*") {
                let splatValue = captureGroups[index] || "";
                pathnameBase = matchedPathname.slice(0, matchedPathname.length - splatValue.length).replace(/(.)\/+$/, "$1");
            }
            const value = captureGroups[index];
            if (isOptional && !value) {
                memo2[paramName!] = void 0;
            } else {
                memo2[paramName!] = (value || "").replace(/%2F/g, "/");
            }
            return memo2;
        },
        {}
    );
    return {
        params,
        pathname: matchedPathname,
        pathnameBase,
        pattern
    };
}

function compilePath<ParamKey extends ParamParseKey<Path>, Path extends string>(path:string, caseSensitive = false, end = true) {
    let params:Params<ParamKey>[] = [];
    let regexpSource = "^" + path.replace(/\/*\*?$/, "").replace(/^\/*/, "/").replace(/[\\.*+^${}|()[\]]/g, "\\$&").replace(
        /\/:([\w-]+)(\?)?/g,
        (_, paramName, isOptional) => {
            params.push({paramName, isOptional: isOptional != null} as Params<ParamKey>);
            return isOptional ? "/?([^\\/]+)?" : "/([^\\/]+)";
        }
    ).replace(/\/([\w-]+)\?(\/|$)/g, "(/$1)?$2");
    if (path.endsWith("*")) {
        params.push({paramName: "*"} as Params<ParamKey>);
        regexpSource += path === "*" || path === "/*" ? "(.*)$" : "(?:\\/(.+)|\\/*)$";
    } else if (end) {
        regexpSource += "\\/*$";
    } else if (path !== "" && path !== "/") {
        regexpSource += "(?:(?=\\/|$))";
    } else {
    }
    let matcher = new RegExp(regexpSource, caseSensitive ? void 0 : "i");
    return [matcher, params] as const;
}

export function useParams<
    T extends Record<string, string | undefined> = Record<string, string | undefined>
>(): T {
    const route = useRoute();

    return route.params as T;
}


export interface Location {
    pathname: string;
    search: string;
    hash: string;
    state: any;
    key: string;
}

export function useLocation(): Location {
    const route = useRoute();

    const fullPath = route.fullPath;
    const searchIndex = fullPath.indexOf('?');

    return {
        pathname: route.path,
        search: searchIndex >= 0 ? fullPath.slice(searchIndex) : '',
        hash: route.hash || '',
        state: history.state,
        key: history.state?.key ?? 'default',
    };
}
