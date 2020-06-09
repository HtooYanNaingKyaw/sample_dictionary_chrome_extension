document.addEventListener('DOMContentLoaded', function() {
    var addNew = document.getElementById("addNew");
    var vocabularyContainer = document.getElementById("vocabularyList");

    var meaningText = document.getElementById("meaning")
    var vocabularyText = document.getElementById("vocabulary")
    var vocabularyList = []
    
    vocabulary.focus()

	chrome.storage.sync.get(["volList"], function(vocabulary){
       
        if(vocabulary) {
            let volList = JSON.parse(vocabulary.volList)
            vocabularyList = volList
            
            buildVocabularyList(volList, vocabularyContainer)
            
        }
	});
	

    addNew.addEventListener('click', function() {
        let data = {
            id: vocabularyList.length + 1,
            vocabulary: vocabularyText.value,
            meaning: meaningText.value,
        }
        vocabularyList.push(data)
        chrome.storage.sync.set({["volList"]: JSON.stringify(vocabularyList) }, function(){
            buildVocabularyList(vocabularyList, vocabularyContainer)
            clearInput(vocabularyText, meaningText)
        });
    })
}, false)

function buildVocabularyList(vocabularies, vocabularyContainer) {
    vocabularyContainer.innerHTML = ''

    var d = document;
    let tmpContainer = d.createElement('div')
    if(vocabularies.length > 0) {
        for(let tmpVol of vocabularies) {
            let container = d.createElement('div')
            container.id = "vocabularyItem"
            
            let vol = d.createElement('input')
            vol.type = "text"
            vol.value = tmpVol.vocabulary
            container.appendChild(vol)

            vol.addEventListener('click', function() {
                this.select()
                d.execCommand('copy')
                showToast()
            })
    
            let meaning = d.createElement('input')
            meaning.type = "text"
            meaning.value = tmpVol.meaning
            container.appendChild(meaning)
            
            meaning.addEventListener('click', function() {
                this.select()
                d.execCommand('copy')
                showToast()
            })

            let delButton = d.createElement('button')
            delButton.textContent = "x"
            container.appendChild(delButton)

            delButton.addEventListener('click', function() {
                let tempContainer = vocabularies.filter(tmp => tmp.id.toString() !== this.nextSibling.value.toString())
                vocabularies = tempContainer
                
                this.parentElement.parentElement.removeChild(this.parentElement)
                chrome.storage.sync.set({["volList"]: JSON.stringify(vocabularies) }, function(){});
            })
            
            let hidden = d.createElement('input')
            hidden.type = "hidden"
            hidden.id = "hidden_input"
            hidden.value = tmpVol.id
            container.appendChild(hidden)

            tmpContainer.appendChild(container)
        }
        vocabularyContainer.appendChild(tmpContainer)
    }
}

function clearInput(vocabulary, meaning) {
    vocabulary.value = ""
    meaning.value = ""
    vocabulary.focus()
}

function showToast() {
    var x = document.getElementById("toast");
    x.className = "show";
    setTimeout(function(){ 
        x.className = x.className.replace("show", ""); 
    }, 2000);
}