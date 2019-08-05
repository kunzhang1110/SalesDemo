export function Capitalize(s){
    return s.replace(/./, x => x.toUpperCase())
}

export var formatDateToString = (date) => {
    return (`${date.getMonth()}/${date.getDate()}/${date.getFullYear()}`)
}