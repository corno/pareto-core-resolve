import * as pt from "pareto-core-types"
import { ResolveContext } from "../types/ResolveContext"

import { ResolveErrorHandler } from "../types/ResolveErrorHandler"


export function createResolveContext<Annotation>(
    callback: ($: ResolveContext) => void,
): boolean {

    type Resolve = () => void
    const references: Resolve[] = []
    callback({
        registerReference: <T>(
            keyToBeFound: string,
            dictionary: pt.Dictionary<T>,
            onError: ResolveErrorHandler
        ): pt.Reference<T> => {
            let entry: undefined | T = undefined

            references.push(() => {
                const foundKeys: string[] = []
                dictionary.forEach((a, b) => a > b, ($, key) => {
                    foundKeys.push(key)
                    if (key === keyToBeFound) {
                        entry = $
                    }
                })
                if (entry === undefined) {
                    foundErrors = true
                    onError()
                }
            })
            return {
                get: () => {
                    if (entry === undefined) {
                        throw new Error("CORE: UNEXPECTED: not resolved")
                    }
                    return entry
                },
                name: keyToBeFound,
            }
        }
    })

    let foundErrors = false
    references.forEach((resolve) => {
        resolve()
    })
    return !foundErrors
}
