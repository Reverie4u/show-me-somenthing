(function () {
  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  // 站点根路径：依据当前页面里 theme.css 的 ../ 层数推导，兼容任意发布子路径
  function siteRoot() {
    var link = document.querySelector('link[rel="stylesheet"]');
    var rel = link ? link.getAttribute('href') : '';
    var up = (rel.match(/\.\.\//g) || []).length;
    var seg = location.pathname.split('/');
    seg = seg.slice(0, -1);
    for (var i = 0; i < up; i++) seg.pop();
    return seg.join('/') + '/';  // 可能是 '/' 或 '/子路径/'，保留用于站点根相对链接
  }

  var TREE = [
    { label: 'Agent', children: [
      { label: '什么是 AI Agent', href: 'agent/what-is-agent.html' },
      { label: '范式', children: [
        { label: 'ReAct', href: 'agent/patterns/react.html' },
        { label: 'Plan-and-Execute', href: 'agent/patterns/plan-execute.html' },
        { label: 'CoT · ToT · GoT', href: 'agent/patterns/reasoning.html' },
        { label: 'Reflection', href: 'agent/patterns/reflection.html' },
        { label: 'LLM任务拆分', href: 'agent/patterns/tasksplit.html' }
      ] }
    ] }
  ];

  function render(root, nodes, depth) {
    depth = depth || 0;
    return nodes.map(function (n) {
      if (n.children) {
        return '<details class="tree-group" open><summary data-depth="' + depth + '">' + n.label + '</summary>' +
          render(root, n.children, depth + 1) + '</details>';
      }
      return '<a class="tree-link" data-depth="' + depth + '" href="' + root + n.href + '">' + n.label + '</a>';
    }).join('\n');
  }

  ready(function () {
    var body = document.body;
    var root = siteRoot();

    var layout = document.createElement('div');
    layout.className = 'layout';
    var sidebar = document.createElement('aside');
    sidebar.id = 'sidebar';
    sidebar.className = 'sidebar';
    sidebar.innerHTML = '<a class="sidebar-brand" href="' + root + 'index.html"><span class="mark"></span>自学笔记</a>' +
      '<nav class="tree">' + render(root, TREE) + '</nav>';

    // 根首页若放有 #site-directory，则把同一份目录渲染进去
    var dir = document.getElementById('site-directory');
    if (dir) dir.innerHTML = '<nav class="tree">' + render(root, TREE) + '</nav>';
    var content = document.createElement('div');
    content.className = 'content';

    // 把原有 body 子节点搬进右侧内容区
    while (body.firstChild) content.appendChild(body.firstChild);

    layout.appendChild(sidebar);
    layout.appendChild(content);
    body.appendChild(layout);

    // 移动端抽屉按钮
    var btn = document.createElement('button');
    btn.id = 'menu-btn';
    btn.className = 'menu-btn';
    btn.type = 'button';
    btn.textContent = '☰ 目录';
    content.appendChild(btn);
    btn.addEventListener('click', function () { sidebar.classList.toggle('open'); });

    function saveSidebar() {
      try {
        sessionStorage.setItem('sbScroll', String(sidebar.scrollTop));
        var open = Array.prototype.map.call(
          sidebar.querySelectorAll('details.tree-group'),
          function (d) { return d.open; }
        );
        sessionStorage.setItem('sbOpen', JSON.stringify(open));
      } catch (e) {}
    }
    function restoreSidebar() {
      try {
        var open = JSON.parse(sessionStorage.getItem('sbOpen') || 'null');
        if (Array.isArray(open)) {
          var ds = sidebar.querySelectorAll('details.tree-group');
          open.forEach(function (v, i) { if (ds[i]) ds[i].open = !!v; });
        }
        sidebar.scrollTop = parseInt(sessionStorage.getItem('sbScroll') || '0', 10) || 0;
      } catch (e) {}
    }

    sidebar.addEventListener('click', function (e) {
      if (e.target && e.target.tagName === 'A') {
        saveSidebar();
        if (window.matchMedia('(max-width: 900px)').matches) sidebar.classList.remove('open');
      }
    });

    restoreSidebar();

    // 高亮当前页
    var cur = location.href.split('#')[0];
    if (cur.slice(-1) === '/') cur += 'index.html';
    sidebar.querySelectorAll('a[href]').forEach(function (a) {
      var href = a.href.split('#')[0];
      if (href === cur) a.classList.add('active');
    });
  });
})();
