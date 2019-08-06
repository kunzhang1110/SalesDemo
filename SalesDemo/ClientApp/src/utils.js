export function Capitalize(s){
    return s.replace(/./, x => x.toUpperCase())
}

export const formatDateToString = (dateObject) => {
    let date, month;
    if (dateObject.getDate().toString().length < 2) {
        date = "0".concat(dateObject.getDate());
    } else {
        date = dateObject.getDate();
    }

    if (dateObject.getMonth().toString().length < 2) {
        month = "0".concat(dateObject.getMonth()+1);
    } else {
        month = dateObject.getMonth()+1;
    }

    return (`${month}/${date}/${dateObject.getFullYear()}`)
}

