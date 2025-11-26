export function sum_to_n_b(num) {
    let total = 0;
    let half = num >> 1
    console.log(half)
    for (let i = 1; i <= half; i++) {
        total += i + (num - i + 1 );
    }
    return num % 2 !== 0 ? total + half + 1 : total
}

export function sum_to_n_c(num) {
    let total = 0;
    for (let i = 1; i <= num; i++) {
        total += i;
    }
    return total;
}

export function sum_to_n_a (num) {
    return (num * (num + 1)) >> 1;
}
