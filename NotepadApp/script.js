document.addEventListener("DOMContentLoaded", function() {
    const dateInput = document.getElementById("date");
    const noteTextarea = document.getElementById("note");
    const saveButton = document.getElementById("saveButton");
    const viewLogButton = document.getElementById("viewLogButton");
    const deleteLogButton = document.getElementById("deleteLogButton");
    const clearStorageButton = document.getElementById("clearStorageButton");
    const logContainer = document.getElementById("logContainer");
    const logContent = document.getElementById("logContent");

    dateInput.addEventListener("change", function() {
        loadNote();
    });

    saveButton.addEventListener("click", function() {
        saveNote();
    });

    viewLogButton.addEventListener("click", function() {
        toggleLogVisibility();
    });

    deleteLogButton.addEventListener("click", function() {
        deleteCurrentLog();
    });

    clearStorageButton.addEventListener("click", function() {
        clearAllData();
    });

    function loadNote() {
        const selectedDate = dateInput.value;
        if (selectedDate) {
            const savedNote = localStorage.getItem(`note-${selectedDate}`);
            noteTextarea.value = savedNote ? savedNote : "";
        }
    }

    function saveNote() {
        const selectedDate = dateInput.value;
        if (selectedDate) {
            const noteContent = noteTextarea.value;
            localStorage.setItem(`note-${selectedDate}`, noteContent);
            saveLog(selectedDate, noteContent);
            noteTextarea.value = ""; // 清空日志编辑框的内容
            viewLog(); // 保存后立即刷新日志列表
        } else {
            alert("请选择一个日期!");
        }
    }

    function saveLog(date, content) {
        const timestamp = new Date().toISOString();
        let logs = JSON.parse(localStorage.getItem("logs")) || [];
        logs.push({ date, timestamp, content });
        localStorage.setItem("logs", JSON.stringify(logs));
        console.log("日志已保存: ", logs);
    }

    function toggleLogVisibility() {
        if (logContainer.style.display === "block") {
            logContainer.style.display = "none";
            viewLogButton.textContent = "查看日志";
        } else {
            viewLog();
            logContainer.style.display = "block";
            viewLogButton.textContent = "隐藏日志";
        }
    }

    function viewLog() {
        logContent.innerHTML = "";
        let logs = JSON.parse(localStorage.getItem("logs")) || [];
        console.log("读取的日志: ", logs);
        
        // 按创建时间倒序排序日志
        logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        
        if (logs.length > 0) {
            logs.forEach(log => {
                const logItem = document.createElement("div");
                logItem.className = "log-item";
                logItem.innerHTML = `<strong>${log.date} ${log.timestamp}</strong><br>${log.content}`;
                logContent.appendChild(logItem);
            });
        } else {
            logContent.innerHTML = "<p>没有日志记录。</p>";
        }
    }

    function deleteCurrentLog() {
        const selectedDate = dateInput.value;
        if (selectedDate) {
            localStorage.removeItem(`note-${selectedDate}`);
            let logs = JSON.parse(localStorage.getItem("logs")) || [];
            logs = logs.filter(log => log.date !== selectedDate);
            localStorage.setItem("logs", JSON.stringify(logs));
            alert("当前日期的日志已删除!");
            viewLog(); // 删除后立即刷新日志列表
        } else {
            alert("请选择一个日期!");
        }
    }

    function clearAllData() {
        if (confirm("确定要清空所有数据吗？")) {
            localStorage.clear();
            viewLog(); // 清空后立即刷新日志列表
        }
    }

    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;
    loadNote();
    viewLog(); // 初次加载时显示日志列表
});

