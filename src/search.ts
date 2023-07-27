import * as fs from "fs";
import { join } from "path";
import SearchResult from "./SearchResult";
import settings from "./Settings";

/* -------------------------------------------------------------------------- */
/*              Here we choose which words we want to search for.             */
/*        We split the query in words, and we add plurals and singulars       */
/*                     to the list of words to search for.                    */
/* -------------------------------------------------------------------------- */
function splitInWords(query: string) {
    return query
        .toLowerCase()
        .split(" ")
        .flatMap((w) => {
            if (w.endsWith("ss")) {
                return [w];
            } else if (w.endsWith("s")) {
                return [w.replace(/s$/, ""), w];
            } else {
                return [w, w + "s"];
            }
        });
}

function isFeuille(path: string) {
    for (const file of fs.readdirSync(path)) {
        if (file === ".gitkeep") {
            return false;
        }
        if (fs.lstatSync(join(path, file)).isDirectory()) {
            return false;
        }
    }
    return true;
}

function getFeuilleFiles(path: string) {
    const res = [];
    for (const file of fs.readdirSync(path)) {
        res.push(join(path, file));
    }
    return res;
}

function getSubpathes(path: string) {
    const res = [];
    for (const file of fs.readdirSync(path)) {
        if (file.startsWith(".")) {
            continue;
        }
        if (fs.lstatSync(join(path, file)).isFile()) {
            continue;
        }
        res.push(join(path, file));
    }
    return res;
}

/* -------------------------------------------------------------------------- */
/*                       This is the important function                       */
/*                    We compute the score of a leaf folder                   */
/* -------------------------------------------------------------------------- */
function computeScore(path: string, words: string[]) {
    let score = 0;
    for (const file of getFeuilleFiles(path)) {
        // Content (x1)
        const content = fs.readFileSync(file, "utf8");
        for (const word of words) {
            const regex = new RegExp(word, "gi");
            const matches = content.match(regex);
            if (matches) {
                score += matches.length;
            }
        }
        // File name (x1000)
        for (const word of words) {
            if (join(path, file).toLowerCase().includes(word)) {
                score += 1000;
            }
        }
    }
    return score;
}

function parcourir(rootPath: string, path: string, words: string[]) {
    let res: { score: number; path: string }[] = [];
    if (isFeuille(path)) {
        const score = computeScore(path, words);
        const displayedPath = path.replace(rootPath, "");
        if (score > 0) {
            res.push({ score, path: displayedPath });
        }
    } else {
        getSubpathes(path).forEach((subPath) => {
            res = res.concat(parcourir(rootPath, subPath, words));
        });
    }
    return res;
}

/* -------------------------------------------------------------------------- */
/*      The exported function doing the search and returning what we want     */
/* -------------------------------------------------------------------------- */
export default function search(rootPath: string, query: string) {
    const words = splitInWords(query);
    return parcourir(rootPath, rootPath, words)
        .sort((a, b) => b.score - a.score)
        .slice(0, settings.maxSearchResults)
        .map(({ path }) => {
            // we remove the score, and search for files within the path to match SearchResult type
            const files = getFeuilleFiles(join(rootPath, path));
            return {
                folderName: path.replace(/^[\\\/]*/, ""),
                fileNames: files.map((file) =>
                    file
                        .replace(rootPath, "")
                        .replace(path, "")
                        .replace(/^[\\\/]*/, "")
                ),
            };
        }) as SearchResult;
}
