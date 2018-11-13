// use localStorage to store the authority info, which might be sent from server in actual project.
export function getAuthority() {
  return localStorage.getItem('antd-pro-authority') || 'guest';
}

export function setAuthority(authority) {
  return localStorage.setItem('antd-pro-authority', authority);
}


export function getAdmin() {
  return localStorage.getItem('antd-pro-admin');
}



export function setAdmin(admin) {
  return localStorage.setItem('antd-pro-admin', JSON.stringify(admin));
}
