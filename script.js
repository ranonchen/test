document.addEventListener("DOMContentLoaded", function() {
    fetch("papers.csv")
        .then(response => response.text())
        .then(text => parseCSV(text))
        .catch(error => console.error("Error loading CSV file:", error));
});

function parseCSV(csvText) {
    const rows = csvText.trim().split("\n").map(row => {
        return row.match(/(".*?"|[^",\n]+)(?=\s*,|\s*$)/g).map(cell => cell.replace(/(^"|"$)/g, '').trim());
    });

    const data = {};
    rows.forEach((row, rowIndex) => {
        if (rowIndex === 0) return; 

        const [week, date, paper, topic, link] = row;
        const weekKey = `Week ${week} (${date})`;
        if (!data[weekKey]) {
            data[weekKey] = {};
        }
        if (!data[weekKey][topic]) {
            data[weekKey][topic] = [];
        }
        data[weekKey][topic].push({ paper, link });
    });

    const container = document.getElementById("csvtable");
    container.innerHTML = ""; 

    Object.keys(data).forEach(weekKey => {
        const weekHeader = document.createElement("h4");
        weekHeader.textContent = weekKey;
        container.appendChild(weekHeader);

        const topics = data[weekKey];

        Object.keys(topics).forEach(topic => {
           
            const topicHeader = document.createElement("h5");
            topicHeader.textContent = topic + ":";
            container.appendChild(topicHeader);

            const list = document.createElement("ul");

            topics[topic].forEach(({ paper, link }) => {
                const listItem = document.createElement("li");
                const paperLink = document.createElement("a");
                paperLink.href = link;
                paperLink.textContent = paper;
                paperLink.target = "_blank"; 
                listItem.appendChild(paperLink);
                list.appendChild(listItem);
            });

            container.appendChild(list);
        });
    });
}







