
jhora.controller('addTransactionCtrl', function($rootScope, $scope, TRANSACTION_TYPES, CUSTOMERS_TABLE, TRANSACTION_TABLE, DELTRANSACTION_TABLE) {
    
    $scope.types = TRANSACTION_TYPES;
    $scope.transaction = { amount: '', date: undefined, promiseDate: undefined, type: '', customerId: '', name: '', village:'', remarks: '' };
    $scope.customer = { name: '', mobile: '', village: '', father: '', guarantor: '', rate:'', date: undefined, pageNo: '', remarks: '' };
    
    $scope.minDate = new Date(new Date().getFullYear() -5, new Date().getMonth(), new Date().getDate());
    $scope.maxDate = new Date();
    $scope.minPromiseDate = new Date();
    $scope.maxPromiseDate = new Date();
    $scope.disablePromiseDate = true;
        
    $scope.cancelUpdate = () =>{
      $rootScope.template = {title: 'Transaction', content :'transaction/viewTransactions.html'};
    };
    
    $scope.dateSelected =()=>{
      $scope.minPromiseDate = $scope.transaction.date;
      $scope.maxPromiseDate = new Date($scope.transaction.date.getFullYear() +1 , $scope.transaction.date.getMonth(), $scope.transaction.date.getDate());
      $scope.disablePromiseDate = false;
    };
    
    $scope.updateSelectedCust = (customerId)=>{
      for(let cust of $scope.customers){
        if(cust.id == customerId){
          $scope.customer = cust;
          console.log('cust',$scope.customer);
        }
      }
    };
    $scope.resetTransaction = ()=>{
      $scope.transaction ={};
      $scope.customer ={};
      $scope.transactionForm.$setPristine();
      $scope.transactionForm.$setUntouched(); 
    };
    
    $scope.addTransaction = ()=>{
      $scope.transaction.name = $scope.customer.name;
      $scope.transaction.village = $scope.customer.village;
      let keys = Object.keys($scope.transaction);
      let values = Object.values($scope.transaction);
      q.insert(TRANSACTION_TABLE, keys, values)
      .then((data)=>{
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
          if(tableName == TRANSACTION_TABLE || tableName == DELTRANSACTION_TABLE)  
          row.promiseDate = new Date(row.promiseDate);
        }
        $scope[modelName] = rows;  
      })
      .catch((err)=>{
        console.error(err);
      });
    };
    
    $scope.getDataByTable(CUSTOMERS_TABLE, CUSTOMERS_TABLE);
    
  });