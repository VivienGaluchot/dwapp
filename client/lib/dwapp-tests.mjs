import dwapp from './dwapp.mjs';

function run() {
    let okCount = 0;
    let koCount = 0;

    console.log(`# DWAPP test run`);

    function title(title) {
        console.log(`## ${title}`);
    }

    function unit(what, isOk) {
        if (isOk) {
            okCount++;
        } else {
            koCount++;
        }
        console.log(`- TEST ${what} - ${isOk ? "OK" : "KO"}`);
    }

    title('API');
    unit('dwapp version', dwapp.version == '0.0.0');

    console.log(`## Recap`);
    if (koCount == 0 && okCount > 0) {
        console.log(`SUCCESS (OK ${okCount}) (KO ${koCount})`);
    } else {
        console.log(`FAILURE (OK ${okCount}) (KO ${koCount})`);
    }
}

export default { run };