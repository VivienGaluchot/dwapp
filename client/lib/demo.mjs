import dwapp from './dwapp.mjs';
import dwappTests from './dwapp-tests.mjs';

function runTests() {
    class DemoTestReporter extends dwappTests.TestReporter {
        constructor(element) {
            super();
            this.element = element;
            this.element.innerHTML = '';
        }

        domLog(text) {
            let el = document.createElement('div');
            el.innerText = text;
            this.element.appendChild(el);
        }

        onStart() {
            super.onStart();
            this.domLog(`# DWAPP test run`);
        }

        onSection(title) {
            super.onSection(title);
            this.domLog(`## ${title}`);
        }

        onUnit(what, isOk) {
            super.onUnit(what, isOk);
            if (isOk) {

            } else {

            }
            this.domLog(`- TEST ${what} - ${isOk ? "OK" : "KO"}`);
        }

        onEnd() {
            super.onEnd();
            this.domLog(`## Recap`);
            if (this.koCount == 0 && this.okCount > 0) {
                this.domLog(`SUCCESS (OK ${this.okCount}) (KO ${this.koCount})`);
            } else {
                this.domLog(`FAILURE (OK ${this.okCount}) (KO ${this.koCount})`);
            }
        }
    }

    let reportElement = document.getElementById('demo-test-report');
    let reporter = new DemoTestReporter(reportElement);
    dwappTests.run(reporter);
}

function init() {
    console.debug(`dwapp loaded version ${dwapp.version}`);
    document.getElementById('demo-test-start-btn').addEventListener('click', event => {
        runTests();
    });
}

document.addEventListener('DOMContentLoaded', event => init());