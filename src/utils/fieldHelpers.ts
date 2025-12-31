
export const getIncomeFieldOptions = (
  field: any, 
  vm: any
) => {
  if (field.name === "categoryId") {
    return { 
      ...field, 
      options: vm.categoryOptions 
    };
  }
  
  if (field.name === "debtId") {
    return { 
      ...field, 
      options: vm.debtOptions 
    };
  }
  
  return field;
};

export const getExpenseFieldOptions = (
  field: any, 
  vm: any
) => {
  if (field.name === "categoryId") {
    return { 
      ...field, 
      options: vm.categoryOptions 
    };
  }
  
  if (field.name === "vendorId") {
    return { 
      ...field, 
      options: vm.vendorOptions 
    };
  }
  
  return field;
};


export const getSharedFieldOptions = (
  field: any,
  vm: any,
  mode: string
) => {
  if (field.name === "santriId" && mode === "income") {
    return {
      ...field,
      options: vm.santriOptions,
    };
  }
  
  return field;
};

export const getPurposeOptions = (
  mode: string, 
  selectedVendor?: string | null
) => {
  if (mode === "income") {
    return [
      { value: "deposit_topup", label: "Isi Saldo" },
      { value: "debt_created", label: "Buat Hutang" },
      { value: "debt_payment", label: "Bayar Hutang" },
      { value: "other", label: "Lainnya" },
    ];
  }
  
  if (mode === "expense") {
    if (selectedVendor) {
      return [{ value: "other", label: "Lainnya" }];
    }
    
    return [
      { value: "deposit_withdrawal", label: "Tarik Saldo" },
      { value: "other", label: "Lainnya" },
    ];
  }
  
  return [];
};