import dwapp from './dwapp.mjs';

class TestReporter {
    constructor() {
        this.okCount = 0;
        this.koCount = 0;
    }

    onStart() { }

    onSection(title) { }

    onUnit(what, isOk) {
        if (isOk) {
            this.okCount++;
        } else {
            this.koCount++;
        }
    }

    onEnd() { }
}

class LogTestReporter extends TestReporter {
    onStart() {
        super.onStart();
        console.log(`# DWAPP test run`);
    }

    onSection(title) {
        super.onSection(title);
        console.log(`## ${title}`);
    }

    onUnit(what, isOk) {
        super.onUnit(what, isOk);
        console.log(`- TEST ${what} - ${isOk ? "OK" : "KO"}`);
    }

    onEnd() {
        super.onEnd();
        console.log(`## Recap`);
        if (this.koCount == 0 && this.okCount > 0) {
            console.log(`SUCCESS (OK ${this.okCount}) (KO ${this.koCount})`);
        } else {
            console.log(`FAILURE (OK ${this.okCount}) (KO ${this.koCount})`);
        }
    }
}

function run(reporter = new LogTestReporter()) {
    reporter.onStart();
    reporter.onSection('API');
    reporter.onUnit('dwapp version defined', dwapp.version !== undefined);
    reporter.onUnit('dwapp version well defined', dwapp.version == '0.0.0');
    reporter.onEnd();
}

export default { run, TestReporter };