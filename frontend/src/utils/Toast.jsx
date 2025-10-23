export const Toastz = (data, toast) => {
  if (data?.success === false) {
    toast.current.show({ severity: 'error', summary: data?.message, detail: 'error' });
  } else if (data?.success === true) {
    toast.current.show({
      severity: 'success',
      summary: data?.message,
      detail: 'success',
    });
  }
};
