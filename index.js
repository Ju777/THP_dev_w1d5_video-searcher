const keywords = [];

let currentKeywords = [];

const keywordsCategories = [
    {
        name: 'Programmation',
        keywords: ['Javascript', 'Promises', 'React', 'Vue JS', 'Angular', 'ES6']
    },
    {
        name: 'Librairie',
        keywords: ['Lecture', 'Livres', 'Conseils librairie', 'Bibliothèque']
    },
    {
        name: 'Jeu vidéo',
        keywords: ['Switch', 'Game Boy', 'Nintendo', 'PS4', 'Gaming', 'DOOM', 'Animal Crossing']
    },
    {
        name: 'Vidéo',
        keywords: ['Streaming', 'Netflix', 'Twitch', 'Influenceur', 'Film']
    }
];

const allKeywords = keywordsCategories.reduce((prevKeywords, category) => [
    ...prevKeywords,
    ...category.keywords
], []);

// If the keyword is present in keywords to take into account and we toggle the checkbox, it means
// the checkbox is now unchecked, so we remove the keyword from keywords to take in account.
// Otherwise, it means that we added a new keyword, or we re-checked a checkbox. So we add the
// keyword in the keywords list to take in account.
const toggleKeyword = (keyword) => {
    keyword = cleanedKeyword(keyword);

    if (currentKeywords.includes(keyword)) {
        currentKeywords = currentKeywords.filter((currentKeyword) => currentKeyword !== keyword);
    } else {
        currentKeywords.push(keyword);
    }

    console.log("CP toggleKeyword => currentKeywords = ");
    console.log(currentKeywords);
    reloadArticles(currentKeywords);
    
    
};

// The first argument is the keyword's label, what will be visible by the user.
// It needs to handle uppercase, special characters, etc.
// The second argument is the value of the checkbox. To be sure to not have bugs, we generally
// put it in lowercase and without special characters.
const addNewKeyword = (label, keyword) => {
    resetInput();

    if (keywords.includes(keyword)) {
        console.warn("You already added this keyword. Nothing happens.");
        return;
    }

    if (!label || !keyword) {
        console.error("It seems you forgot to write the label or keyword in the addNewKeyword function");
        return;
    }

    keywords.push(cleanedKeyword(keyword));
    currentKeywords.push(cleanedKeyword(keyword));


    document.querySelector('.keywordsList').innerHTML += `
        <div>
            <input id="${label}" value="${keyword}" type="checkbox" checked onchange="toggleKeyword(this.value)">
            <label for="${label}">${label}</label>
        </div>
    `;


    // reloadArticles(); ORIGINAL
    reloadArticles(keywords);
    resetKeywordsUl();
};

// We reload the articles depends of the currentKeywords
// TODO: Modify this function to display only articles that contain at least one of the selected keywords.
const reloadArticles = (keywords) => {
    // vérif
    console.log("CP reloadArticles, keywords (en paramètres) = ");
    console.log(keywords);

    document.querySelector('.articlesList').innerHTML = '';

    // const articlesToShow = data.articles; ORIGINAL, AJOUT EN DESSOUS

    const articlesToShow = [];


    keywords.forEach(keyword => {
            let matchingArticles = data.articles.filter(article => article.tags.includes(keyword));
            for (let i = 0 ; i < matchingArticles.length ; i++) {
                articlesToShow.push(matchingArticles[i]);
            }
    });



    articlesToShow.forEach((article) => {
        document.querySelector('.articlesList').innerHTML += `
            <article>
                <h2>${article.titre}</h2>
            </article>
        `;
    });

};

// We empty the content from the <ul> under the text input
const resetKeywordsUl = () => {
    document.querySelector('.inputKeywordsHandle ul').innerHTML = '';
};

// We add a new article. The argument is an object with a title
const addNewArticle = (article) => {
    document.querySelector('.articlesList').innerHTML += `
        <article>
            <h2>${article.titre}</h2>
        </article>
    `;
};

// We empty the text input once the user submits the form
const resetInput = () => {
    document.querySelector("input[type='text']").value = "";
};

// Clean a keyword to lowercase and without special characters
// TODO: Make the cleaning
const cleanedKeyword = (keyword) => {
    myRegexp = /[^\w]+/g;
    keyword = keyword.replace(myRegexp, '');
    const cleanedKeyword = keyword.toLowerCase();

    return cleanedKeyword;
};

// TODO: Modify this function to show the keyword containing a part of the word inserted
// into the form (starting autocompletion at 3 letters).
// TODO: We also show all the words from the same category than this word.
// TODO: We show in first the keyword containing a part of the word inserted.

// TODO: If a keyword is already in the list of presents hashtags (checkbox list), we don't show it.
const showKeywordsList = (value) => {

    value = cleanedKeyword(value);
    // let firstValue;

    // Starting at 3 letters inserted in the form, we do something
    if (value.length >= 3) {
        const keyWordUl = document.querySelector(".inputKeywordsHandle ul");
        resetKeywordsUl();
        
        let matchedKeywords = [];
        // Recherche du (ou des) mot-clé qui contient la valeur saisie
        allKeywords.forEach(keyword => {
            keyword = keyword.toLowerCase();
            if (keyword.includes(value.substring(0,3))) {
                matchedKeywords.push(keyword);
            }
        });
        console.log("LOG de matchedKeywords = ");
        console.log(matchedKeywords);

        // Recherche des catégories qui contiennent ce (ou ces) mots-clés
        let matchedCategories = [];
        matchedKeywords.forEach(matchedKeyword => {
            keywordsCategories.forEach(category => {
                category.keywords.forEach(keyword => {
                    if (keyword.toLowerCase() === matchedKeyword) {
                        matchedCategories.push(category);
                    }
                });
            });
        });

        console.log("LOG de matchedCategories = ");
        console.log(matchedCategories);

        // Affichage de tous les mots-clés en dessous de la zone de recherche, à commencer par ceux qui correspondent à la saisie user.
        for(let i = 0 ; i < matchedKeywords.length ; i++ ) {
            keyWordUl.innerHTML += `<li onclick="addNewKeyword('${matchedKeywords[i]}', '${matchedKeywords[i]}')">${matchedKeywords[i]}</li>`;
        }
        for(let i = 0 ; i < matchedCategories.length ; i++ ) {
            for(let j = 0 ; j < matchedCategories[i].keywords.length ; j++) {
                if (matchedKeywords.includes(matchedCategories[i].keywords[j].toLowerCase()) === false) {
                    keyWordUl.innerHTML += `<li onclick="addNewKeyword('${matchedCategories[i].keywords[j]}', '${matchedCategories[i].keywords[j]}')">${matchedCategories[i].keywords[j]}</li>`;
                }
            }
        }


    }
};

// Once the DOM (you will se what is it next week) is loaded, we get back our form and
// we prevent the initial behavior of the navigator: reload the page when it's submitted.
// Then we call the function addNewKeyword() with 2 arguments: the label value to show,
// and the checkbox value.
window.addEventListener('DOMContentLoaded', () => {
    const inputElement = document.querySelector('input[type="text"]');

    document.querySelector('.addKeywordsForm').addEventListener('submit', (event) => {
        event.preventDefault();
        const keywordInputValue = inputElement.value;
        addNewKeyword(keywordInputValue, cleanedKeyword(keywordInputValue));
    });

    inputElement.addEventListener('input', (event) => {
        const { value } = event.currentTarget;
        showKeywordsList(value);
    });

    data.articles.forEach((article) => {
        addNewArticle(article);
    });
});
