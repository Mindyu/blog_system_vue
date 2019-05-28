<template>
    <div class="about-wrapper">
        <h1>个人博客系统设计与实现</h1>
        <p>基于Go语言的个人博客系统</p>
        <hr />
        <h3>采用前后端分离的架构</h3>
        <p>前端使用Vue+ElementUI框架及组件</p>
        <p>后端使用 Gin+Gorm 框架实现 RESTful 风格的微服务</p>
        <p><img src='../../../../static/img/background.jpg' alt='后台首页' style="width: 60%; height: 60%"/></p>
        <p>&nbsp;</p>
        <h3>Feature </h3>
        <ul>
            <li>前后端分离</li>
            <li>RESTful 的风格（一种软件架构风格、设计风格，而<strong>不是</strong>标准，只是提供了一组设计原则和约束条件。它主要用于客户端和服务器交互类的软件。基于这个风格设计的软件可以更简洁，更有层次，更易于实现缓存等机制。）</li>
            <li>前端 MVC 三层架构， 减少耦合 （Vue 和 AngularJS的选型）</li>
            <li>前后端采用 JSON 格式交互</li>
            <li>CORS 跨域请求方案</li>
            <li>JWT 认证 （Redis 和 JWT (JSON Web Tokens) 的选型）</li>
            <li>中间件的应用</li>
            <li>路由分组</li>
            <li>后端 MVC 的架构</li>
            <li>MD5 + salt 加密方式</li>
            <li>权限的控制</li>
            <li>govendor  项目依赖管理</li>

        </ul>
        <p>&nbsp;</p>
        <h3>Todo</h3>
        <ul>
            <li><p><input type='checkbox' disabled='disabled' checked/>博客首页美化、添加标签（分类）、添加归档、添加热门、评论排序</p>
            </li>
            <li><p><input type='checkbox' disabled='disabled' checked/>评论回复管理</p>
            </li>
            <li><p><input type='checkbox' disabled='disabled' checked/>文件上传、下载</p>
            </li>
            <li><p><input type='checkbox' disabled='disabled' checked/>系统日志</p>
            </li>
            <li><p><input type='checkbox' disabled='disabled' checked/>权限控制</p>
            </li>
            <li><p><input type='checkbox' disabled='disabled' checked/>关注管理（单向）好友管理（双向）</p>
            </li>
            <li><p><input type='checkbox' disabled='disabled' checked/>私信管理</p>
            </li>
            <li><p><input type='checkbox' disabled='disabled' checked/>后台首页统计功能</p>
            </li>
            <li><p><input type='checkbox' disabled='disabled' />Ngnix 反向代理和负载均衡</p>
                <p>&nbsp;</p>
            </li>

        </ul>
        <p>&nbsp;</p>
        <h3>Annotation</h3>
        <ol start='' >
            <li>JWT 是一种用于双方之间传递安全信息的简洁的、URL 安全的表述性声明规范。JWT 作为一个开放的标准（RFC 7519），定义了一种简洁的，自包含的方法用于通信双方之间以 Json 对象的形式安全的传递信息。因为数字签名的存在，这些信息是可信的，JWT 可以使用 HMAC 算法或者是 RSA 的公私秘钥对进行签名。简洁(Compact): 可以通过 URL，POST 参数或者在 HTTP header 发送，因为数据量小，传输速度也很快而且 JWT 的 token 串中的负载中包含了所有用户所需要的信息，避免了多次查询数据库。JWT 很好的解决了分布式系统中会话状态保持的问题。 单点登录（SSO）的应用</li>
            <li>CSRF（Cross-site request forgery）跨域请求攻击：浏览器对采用了同源策略，所谓同源是指，域名，协议，端口相同。如果是非同源的那么请求就会被浏览器所限制。针对跨域有很多的解决方案，本系统采用 CORS（Cross-Origin Resource Sharing, 跨源资源共享）</li>

        </ol>
        <p>&nbsp;</p>
        <h3>接口API文档</h3>
        <h4>用户信息</h4>
        <ol start='' >
            <li>用户登录：POST </li>

        </ol>
        <p>form 表单提交用户名和密码信息</p>
        <p><a href='http://localhost:8081/user/login' target='_blank' class='url'>http://localhost:8081/user/login</a> </p>
        <p>&nbsp;</p>
        <ol start='2' >
            <li>用户查询（根据id）： GET</li>

        </ol>
        <p><a href='http://localhost:8081/user/query?id=3' target='_blank' class='url'>http://localhost:8081/user/query?id=3</a> </p>
        <p>&nbsp;</p>
        <ol start='3' >
            <li>用户信息更新：PUT</li>

        </ol>
        <p><a href='http://localhost:8081/user/edit?id=20' target='_blank' class='url'>http://localhost:8081/user/edit?id=20</a> </p>
        <pre><code class='language-json' lang='json'>	{
        &quot;username&quot;: &quot;chen&quot;,
        &quot;nickname&quot;: {
            &quot;String&quot;: &quot;chen&quot;,
            &quot;Valid&quot;: true
        },
        &quot;password&quot;: &quot;123456&quot;,
        &quot;avatar&quot;: {
            &quot;String&quot;: &quot;http://localhost:8081/1148527767.jpg&quot;,
            &quot;Valid&quot;: true
        },
        &quot;sign&quot;: {
            &quot;String&quot;: &quot;生活不止眼前的苟且，还有诗和远方&quot;,
            &quot;Valid&quot;: true
        }
    }
</code></pre>
        <p>&nbsp;</p>
        <ol start='4' >
            <li>用户删除：DELETE（软删除）</li>

        </ol>
        <p><a href='http://localhost:8081/user/delete?id=19' target='_blank' class='url'>http://localhost:8081/user/delete?id=19</a> </p>
        <p>&nbsp;</p>
        <ol start='5' >
            <li>新增用户：POST</li>

        </ol>
        <p><a href='http://localhost:8081/user/add' target='_blank' class='url'>http://localhost:8081/user/add</a> </p>
        <pre><code class='language-json' lang='json'>{
    &quot;username&quot;: &quot;qiang&quot;,
    &quot;nickname&quot;: {
        &quot;String&quot;: &quot;qiang&quot;,
        &quot;Valid&quot;: true
    },
    &quot;password&quot;: &quot;123456&quot;,
    &quot;avatar&quot;: {
        &quot;String&quot;: &quot;http://localhost:8081/1148527767.jpg&quot;,
        &quot;Valid&quot;: true
    },
    &quot;phone&quot;: {
        &quot;String&quot;: &quot;1234658&quot;,
        &quot;Valid&quot;: true
    },
    &quot;email&quot;: {
        &quot;String&quot;: &quot;15465656565@qq.com&quot;,
        &quot;Valid&quot;: true
    },
    &quot;birthday&quot;: {
        &quot;String&quot;: &quot;2010-02-02&quot;,
        &quot;Valid&quot;: true
    },
    &quot;education&quot;: {
        &quot;String&quot;: &quot;本科&quot;,
        &quot;Valid&quot;: true
    }
}
</code></pre>
        <p>&nbsp;</p>
        <p>&nbsp;</p>
        <h3>遇到过的问题</h3>
        <ol start='' >
            <li>gin 框架 axios 的 delete 请求传参问题（参考源码，delete请求接受两个参数，需要对参数的格式设定）</li>

        </ol>
        <pre><code class='language-javascript' lang='javascript'>var params = {
	&#39;data&#39;:{
		&#39;user_name&#39;: localStorage.getItem(&#39;ms_username&#39;),
		&#39;friend_name&#39;: this.friendName
    }
} // https://blog.csdn.net/qq383366204/article/details/80268007
</code></pre>
        <ol start='2' >
            <li>golang结构体json的时间格式化解决方案 <a href='https://www.jianshu.com/p/03003d5cbdbc' target='_blank' class='url'>https://www.jianshu.com/p/03003d5cbdbc</a></li>

        </ol>
        <pre><code class='language-go' lang='go'>
// 实现它的json序列化方法
func (this Log) MarshalJSON() ([]byte, error) {
	// 定义一个该结构体的别名
	type AliasCom Log
	// 定义一个新的结构体
	tmp := struct {
		AliasCom
		CreatedAt string `json:&quot;created_at&quot;`
		UpdatedAt string `json:&quot;updated_at&quot;`
	}{
		AliasCom:  (AliasCom)(this),
		CreatedAt: this.CreatedAt.Format(&quot;2006-01-02 15:04:05&quot;),
		UpdatedAt: this.UpdatedAt.Format(&quot;2006-01-02 15:04:05&quot;),
	}
	return json.Marshal(tmp)
}
</code></pre>
        <ol start='3' >
            <li>系统日志模块，处理器串联，提示解析参数失败，ShouldBindJSON 报EOF错误。原因是c.Request.Body只能读取一次<a href='https://blog.csdn.net/impressionw/article/details/84194783' target='_blank' class='url'>https://blog.csdn.net/impressionw/article/details/84194783</a>， 日志参数首先从body中取，然后从url中的参数中取。</li>

        </ol>
        <p>&nbsp;</p>
    </div>
</template>

<script>

</script>
<style>
    .about-wrapper {
        width: 80%;
        padding: 1rem;;
    }

    .about-wrapper p, .about-wrapper h2, .about-wrapper a {
        margin: 1rem auto;
    }

    .about-wrapper p {
        font-size: 1.8rem;
    }

    .sentence {
        font-size: 1.5rem;
    }

    @media screen and (max-width: 768px) {
        .about-wrapper p {
            font-size: 1.6rem;
        }

    }
</style>
