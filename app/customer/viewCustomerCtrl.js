
jhora.controller('viewCustomerCtrl', function($rootScope, $scope, $timeout, VIEW_LIMITS, CUSTOMERS_TABLE, DELCUSTOMERS_TABLE) {
    
    $scope.limits = VIEW_LIMITS;
    $scope.queryFor = $scope.limits[0];
    $scope.customer = { name: '', mobile: '', village: '', father: '', rate: '', guarantor: '', date: undefined, pageNo: '', remarks: '' };
    $scope.hideNoDataFound = true; 
        
    $scope.editCustomer = (customer)=>{
      // TODO
      $rootScope.editModeData = customer;
      $rootScope.template = {title: 'Edit Customer', content :'customer/updateCustomer.html'};
      
    };
    
    $scope.deleteCustomer = (customer)=>{
      shell.beep();
      dialog.showMessageBox({
          type: 'question',
          buttons: ['Yes', 'No'],
          title: 'Confirm',
          message: `Are you sure you want to delete ${customer.name}?`
      }, function (response) {
          if (response === 0) {
            let  {name, mobile, village, father, rate, guarantor, date, pageNo, remarks } = customer;
            let keys = ['name', 'mobile', 'village', 'father', 'rate', 'guarantor', 'date', 'pageNo', 'remarks'];
            let values =[name, mobile, village, father, rate, guarantor, date, pageNo, remarks];
            q.insert(DELCUSTOMERS_TABLE, keys, values)
            .then((data)=>{
              return q.deleteRowById(CUSTOMERS_TABLE, customer.id);
            })
            .then((data)=>{
              $scope.getCustomers(CUSTOMERS_TABLE);
              dialog.showMessageBox({type :'info', message:`${customer.name} deleted`, buttons:[]});
            })
            .catch((err)=>{
              console.error('anp an err occured while deleting', customer);
            });
          }
      })
    };
    
    $scope.sortBy = function(propertyName) {
      $scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse : false;
      $scope.propertyName = propertyName;
    };
    
    $scope.getCustomers = (tableName)=>{
      q.selectAll(tableName)
      .then((rows)=>{
        if(rows)
        for(let row of rows){
          row.date = row.date ? new Date(row.date) : undefined;
        }
        $timeout(()=>{
          $scope.customers = rows;
          if(tableName == CUSTOMERS_TABLE && rows && rows.length == 0)
          $scope.hideNoDataFound = false; 
        },0); 
      })
      .catch((err)=>{
        console.error(err);
      });
    };
    
    $scope.getNewData= (queryFor)=>{
      if(queryFor == $scope.limits[1]) {
        $scope.getCustomers(DELCUSTOMERS_TABLE);
      }else{
        $scope.getCustomers(CUSTOMERS_TABLE);
      }
    };
    $scope.getCustomers(CUSTOMERS_TABLE);

   $scope.viewCustomerPassbook = (customer)=>{
    // TODO
    $rootScope.viewPassbookData = customer;
    $rootScope.template = {title: `Passbook for A/c No.-${customer.id}` , content :'passbook/viewPassbook.html'};
   };
    
  });