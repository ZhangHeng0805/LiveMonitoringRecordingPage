function getMainUrl(fullUrl) {
  // const fullUrl = window.location.href;
  // 初始化默认基础URL
  let mainUrl = "http://localhost:8005/";
  // 处理当前页面URL（如果是http开头）
  if (fullUrl.startsWith("http")) {
    mainUrl = fullUrl.split("?")[0];
  }
  // 处理URL参数中的url（优先级更高）
  const urlParams = new URLSearchParams(window.location.search);
  const urlParam = urlParams.get("url");
  const redirectParam = urlParams.get("redirect");

  if (urlParam) {
    // 解码参数中的URL（支持http开头的明文和base64编码）
    mainUrl = urlParam.startsWith("http")
      ? decodeURIComponent(urlParam)
      : atob(urlParam);
  } else if (redirectParam) {
    getRedirectURL(redirectParam)
    .then((data) =>{
        mainUrl=data;
    });
  }
  // 确保URL以斜杠结尾
  return mainUrl.endsWith("/") ? mainUrl : `${mainUrl}/`;
}

async function getRedirectURL(JSON_URL) {
  return await new Promise((resolve) => {
    fetch(JSON_URL)
      .then((response) => {
        // 检查响应状态
        if (!response.ok) {
          throw new Error(`请求失败：${response.status}`);
        }
        // 解析JSON数据
        return response.json();
      })
      .then((mockData) => {
        console.log("getRedirectURL获取的数据", mockData);
        // 处理数据
        const targetUrl = config.redirectUrl;
        // 校验URL
        if (!targetUrl) throw new Error("JSON 中未找到 redirectUrl 字段");
        resolve(targetUrl);
      })
      .catch((error) => {
        console.error("获取getRedirectURL失败", error);
      });
  });
}
