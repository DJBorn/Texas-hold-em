var model = myTable.getModel();
setInterval(() => {
    model = myTable.getModel();
    document.getElementById('timer').innerHTML = model.timer;
}, 100);


console.log(model);