// BillSavers - Main JavaScript File

// LocalStorage functions
function saveBills(bills) {
    localStorage.setItem('billsData', JSON.stringify(bills));
}

function loadBills() {
    return JSON.parse(localStorage.getItem('billsData')) || [];
}

function saveSavingsGoals(goals) {
    localStorage.setItem('savingsGoals', JSON.stringify(goals));
}

function loadSavingsGoals() {
    return JSON.parse(localStorage.getItem('savingsGoals')) || [];
}

function saveSettings(settings) {
    localStorage.setItem('settings', JSON.stringify(settings));
}

function loadSettings() {
    return JSON.parse(localStorage.getItem('settings')) || {
        theme: 'light',
        currency: 'USD',
        billReminders: true,
        savingsAlerts: true
    };
}

// Bills Page
if (document.getElementById('bill-form')) {
    const form = document.getElementById('bill-form');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const bill = {
            id: Date.now(),
            name: document.getElementById('bill-name').value,
            amount: parseFloat(document.getElementById('bill-amount').value),
            dueDate: document.getElementById('bill-due-date').value,
            frequency: document.getElementById('bill-frequency').value
        };
        
        const bills = loadBills();
        bills.push(bill);
        saveBills(bills);
        
        form.reset();
        displayBills();
    });
    
    function displayBills() {
        const bills = loadBills();
        const billsList = document.getElementById('bills-list');
        
        if (bills.length === 0) {
            billsList.innerHTML = '<p class="empty-message">No bills added yet. Create one above!</p>';
            return;
        }
        
        billsList.innerHTML = bills.map(bill => `
            <div class="bill-item" style="background: white; padding: 1rem; border-radius: 5px; border-left: 4px solid #667eea;">
                <h4>${bill.name}</h4>
                <p>Amount: $${bill.amount.toFixed(2)}</p>
                <p>Due Date: ${bill.dueDate}</p>
                <p>Frequency: ${bill.frequency}</p>
                <button onclick="deleteBill(${bill.id})" class="btn-secondary">Delete</button>
            </div>
        `).join('');
    }
    
    window.deleteBill = function(id) {
        const bills = loadBills();
        const updatedBills = bills.filter(b => b.id !== id);
        saveBills(updatedBills);
        displayBills();
    };
    
    displayBills();
}

// Dashboard
if (document.getElementById('total-bills')) {
    function updateDashboard() {
        const bills = loadBills();
        const goals = loadSavingsGoals();
        
        const totalBills = bills.reduce((sum, bill) => sum + bill.amount, 0);
        const savingGoal = goals.reduce((sum, goal) => sum + goal.targetAmount, 0);
        const currentSavings = goals.reduce((sum, goal) => sum + goal.currentSaved, 0);
        
        document.getElementById('total-bills').textContent = '$' + totalBills.toFixed(2);
        document.getElementById('savings-goal').textContent = '$' + savingGoal.toFixed(2);
        document.getElementById('current-savings').textContent = '$' + currentSavings.toFixed(2);
        
        const progress = savingGoal > 0 ? (currentSavings / savingGoal) * 100 : 0;
        document.getElementById('progress-fill').style.width = Math.min(progress, 100) + '%';
        document.getElementById('progress-text').textContent = Math.round(progress) + '%';
        
        // Display recent bills
        const recentBillsList = document.getElementById('recent-bills-list');
        if (bills.length === 0) {
            recentBillsList.innerHTML = '<p class="empty-message">No bills yet. <a href="bills.html">Add your first bill</a></p>';
        } else {
            recentBillsList.innerHTML = bills.slice(0, 3).map(bill => `
                <div class="bill-item" style="background: white; padding: 1rem; border-radius: 5px; border-left: 4px solid #667eea; margin-bottom: 1rem;">
                    <h4>${bill.name}</h4>
                    <p>$${bill.amount.toFixed(2)} - Due: ${bill.dueDate}</p>
                </div>
            `).join('');
        }
    }
    
    updateDashboard();
}

// Savings Page
if (document.getElementById('savings-form')) {
    const form = document.getElementById('savings-form');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const targetAmount = parseFloat(document.getElementById('target-amount').value);
        const currentSaved = parseFloat(document.getElementById('current-saved').value);
        const monthlyContribution = parseFloat(document.getElementById('monthly-contribution').value);
        const deadline = document.getElementById('savings-deadline').value;
        
        const remaining = targetAmount - currentSaved;
        const monthsNeeded = monthlyContribution > 0 ? Math.ceil(remaining / monthlyContribution) : Infinity;
        
        const results = `
            <div style="background: #f5f5f5; padding: 1.5rem; border-radius: 5px;">
                <p><strong>Target Amount:</strong> $${targetAmount.toFixed(2)}</p>
                <p><strong>Current Savings:</strong> $${currentSaved.toFixed(2)}</p>
                <p><strong>Remaining:</strong> $${remaining.toFixed(2)}</p>
                <p><strong>Monthly Contribution:</strong> $${monthlyContribution.toFixed(2)}</p>
                <p><strong>Months Needed:</strong> ${monthsNeeded === Infinity ? 'N/A' : monthsNeeded}</p>
                <p><strong>Target Deadline:</strong> ${deadline}</p>
            </div>
        `;
        
        document.getElementById('results').innerHTML = results;
        
        // Save the goal
        const goal = {
            id: Date.now(),
            name: document.getElementById('goal-name').value,
            targetAmount: targetAmount,
            currentSaved: currentSaved,
            monthlyContribution: monthlyContribution,
            deadline: deadline
        };
        
        const goals = loadSavingsGoals();
        goals.push(goal);
        saveSavingsGoals(goals);
        
        form.reset();
        displaySavingsGoals();
    });
    
    function displaySavingsGoals() {
        const goals = loadSavingsGoals();
        const goalsList = document.getElementById('goals-list');
        
        if (goals.length === 0) {
            goalsList.innerHTML = '<p class="empty-message">No savings goals created yet. Create one above!</p>';
            return;
        }
        
        goalsList.innerHTML = goals.map(goal => `
            <div class="goal-item" style="background: white; padding: 1rem; border-radius: 5px; border-left: 4px solid #667eea; margin-bottom: 1rem;">
                <h4>${goal.name}</h4>
                <p>Target: $${goal.targetAmount.toFixed(2)}</p>
                <p>Saved: $${goal.currentSaved.toFixed(2)}</p>
                <button onclick="deleteSavingsGoal(${goal.id})" class="btn-secondary">Delete</button>
            </div>
        `).join('');
    }
    
    window.deleteSavingsGoal = function(id) {
        const goals = loadSavingsGoals();
        const updatedGoals = goals.filter(g => g.id !== id);
        saveSavingsGoals(updatedGoals);
        displaySavingsGoals();
    };
    
    displaySavingsGoals();
}

// Settings Page
if (document.getElementById('save-settings')) {
    const settings = loadSettings();
    
    document.getElementById('theme-select').value = settings.theme;
    document.getElementById('currency-select').value = settings.currency;
    document.getElementById('bill-reminders').checked = settings.billReminders;
    document.getElementById('savings-alerts').checked = settings.savingsAlerts;
    
    document.getElementById('save-settings').addEventListener('click', function() {
        const newSettings = {
            theme: document.getElementById('theme-select').value,
            currency: document.getElementById('currency-select').value,
            billReminders: document.getElementById('bill-reminders').checked,
            savingsAlerts: document.getElementById('savings-alerts').checked
        };
        
        saveSettings(newSettings);
        alert('Settings saved successfully!');
    });
    
    document.getElementById('reset-settings').addEventListener('click', function() {
        if (confirm('Are you sure you want to reset all settings to defaults?')) {
            saveSettings({
                theme: 'light',
                currency: 'USD',
                billReminders: true,
                savingsAlerts: true
            });
            location.reload();
        }
    });
    
    document.getElementById('export-data').addEventListener('click', function() {
        const data = {
            bills: loadBills(),
            savingsGoals: loadSavingsGoals(),
            settings: loadSettings()
        };
        
        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'billsavers-data.json';
        link.click();
    });
    
    document.getElementById('clear-data').addEventListener('click', function() {
        if (confirm('Are you sure you want to delete all data? This cannot be undone!')) {
            localStorage.clear();
            alert('All data has been cleared!');
            location.reload();
        }
    });
}
