
jhora.controller('transactionCtrl', function($scope) {

    $scope.types = ['Dr', 'Cr', 'Settle'];
    $scope.limits = ['All', 'Deleted'];
    $scope.queryFor = 'All';
    $scope.transaction = { amount: '', date: undefined, promiseDate: undefined, type: '', customerId: '', customer: '', address:'', remarks: '' };
    $scope.customer = { name: '', mobile: '', address: '', father: '', guarantor: '', rate:'', date: undefined, pageNo: '', remarks: '' };
    
    $scope.editTransaction = (transaction)=>{
      console.log('anp edit', transaction);
    };
    
    $scope.deleteTransaction = (transaction)=>{
      shell.beep
      dialog.showMessageBox({
          type: 'question',
          buttons: ['Yes', 'No'],
          title: 'Confirm',
          message: `Are you sure you want to delete ${transaction.customer}'s transaction'?`
      }, function (response) {
          if (response === 0) {
           let  {amount, date, promiseDate, type, customerId, customer, address, remarks } = transaction;
           let keys = ['amount', 'date', 'promiseDate', 'type', 'customerId', 'customer', 'address', 'remarks' ];
           let values =[amount, date, promiseDate, type, customerId, customer, address, remarks];
            q.insert('deltransactions', keys, values)
            .then((data)=>{
              return q.deleteRowById('transactions', transaction.id);
            })
            //q.deleteRowById('transactions', transaction.id)
            .then((data)=>{
              $scope.getDataByTable('transactions', 'transactions');
              dialog.showMessageBox({type :'info', message:`${transaction.customer}'s transaction deleted`, buttons:[]});
            })
            .catch((err)=>{
              console.error('anp an err occured while deleting', transaction);
            });
          }
      })
    };
    
    $scope.resetTransaction = ()=>{
      $scope.transaction ={};
      $scope.customer ={};
      $scope.transactionForm.$setPristine();
      $scope.transactionForm.$setUntouched(); 
    };
    
    $scope.sortBy = function(propertyName) {
      $scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse : false;
      $scope.propertyName = propertyName;
    };
    
    $scope.submitTransaction = ()=>{
      $scope.transaction.customerId = $scope.customer.id;
      $scope.transaction.customer = $scope.customer.name;
      $scope.transaction.address = $scope.customer.address;
      let keys = Object.keys($scope.transaction);
      let values = Object.values($scope.transaction);
      q.insert('transactions', keys, values)
      .then((data)=>{
          $scope.getDataByTable('transactions', 'transactions');
          $scope.resetTransaction();
          dialog.showMessageBox({type :'info', message:'Data submitted', buttons:[]});
      })
      .catch((err)=>{
          console.error('anp err, transaction insertion', err);
      });
    };
    
    $scope.getDataByTable = (tableName, modelName)=>{
      q.selectAll(tableName)
      .then((rows)=>{  
        if(rows)
        for(let row of rows){
          row.date = new Date(row.date);
          if(tableName == 'transactions' || tableName == 'deltransactions')  
          row.promiseDate = new Date(row.promiseDate);
        }
        $scope[modelName] = rows;  
      })
      .catch((err)=>{
        console.error(err);
      });
    };
    
    $scope.getNewData= (queryFor)=>{
      if(queryFor == 'Deleted') {
        $scope.getDataByTable('deltransactions', 'transactions');
      }else{
        $scope.getDataByTable('transactions', 'transactions');
      }
    }
    
    $scope.getDataByTable('transactions', 'transactions');
    $scope.getDataByTable('customers', 'customers');
    
  });