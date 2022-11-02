const listSearch = async () => {
    const id = document.getElementById('id').value;
    const c1 = document.getElementById('c1').value;
    const c2 = document.getElementById('c2').value;

    const queryString = new URLSearchParams({ id, c1, c2 });

    const response = await fetch('/test/search?' + queryString, {
        method: 'GET'
    }).then(async (res) => {
        return await res.json();
    });

    let tableHtml = '';

    for (let i = 0; i < response.data.length ; i++) {
        tableHtml += `
        <tr>
            <td>${response.data[i].id}</td>
            <td>${response.data[i].c1}</td>
            <td>${response.data[i].c2}</td>
            <td><a href="/test/edit?id=${response.data[i].id}">編輯</a></td>
        </tr>`;
    }

    document.querySelector('#test_table tbody').innerHTML = tableHtml;
};

document.getElementById('id').addEventListener('change', listSearch);
document.getElementById('c1').addEventListener('change', listSearch);
document.getElementById('c2').addEventListener('change', listSearch);