import { InfiniteAutocomplete } from 'infinite-autocomplete';

function onReadyStateChange(resolver: any, rejecter: any) {
    if (this.readyState == 4) { // 4 - Complete
        if ((this.status >= 200 && this.status < 300) || this.status == 304) {
            resolver(JSON.parse(this.responseText).data.items.map((actor: any) => ({ text: actor.displayAs, value: actor.actorId })));
        } else {
            rejecter(this.status);
        }
    }
}
        
function httpCallPromise(url: string, searchString: string, pageIndex: number, pageSize: number) {
    return new Promise(function(resolve, reject) {
        // Make an async HTTP request

        var async = true;
        var xhr = new XMLHttpRequest();
        xhr.open('post', url, async);
        xhr.setRequestHeader("Content-Type", "application/json");
        const data = { Data: {
            "pageSize": pageSize,
            "pageIndex": pageIndex,
            "state": "CA",
            "countryAbbr": "US",
            "searchPattern": searchString
        }};
        xhr.send(JSON.stringify(data));
    
        xhr.onreadystatechange = onReadyStateChange.bind(xhr, resolve, reject);
    });
}

var baseUrl = "http://localhost:5001/CustomerPortalWeb/";
var resource = "Customer/Search";

// var promise = httpCallPromise(baseUrl + resource).then(value => console.log(value))
//         .catch(error => {
//             console. log("An error occurred while getting the data");
//             if (error) {
//                 console.log("Status " + error);
//             }
//         });

var remoteCallAutocomplete = new InfiniteAutocomplete(
    <HTMLElement>document.getElementsByClassName("autocomplete-container")[0], {
        onSelect: function(target: any, selectedOption: any) {
            console.log("selected: ", selectedOption);
        },
        getDataFromApi: httpCallPromise.bind(null, baseUrl + resource)
    });
