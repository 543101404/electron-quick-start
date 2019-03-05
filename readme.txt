对于一个node_modules为空的项目，要先安装 electron，addon要指定32位或64位。
相关组件装完后，要 rebuild来完成addon的重构，如果之前没加 --arch 会报错


32位下安装组件一定要加上 --arch=ia32 -abi=69
like:
npm install winax --arch=ia32 -abi=69
npm install electron@4.0.4 --arch=ia32 