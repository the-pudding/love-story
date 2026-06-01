import"../chunks/DsnmJJEf.js";import{al as f,a1 as v,a3 as S,a2 as u,t as z,M as i,an as R,Q as j,aE as ke,am as P,$ as V,a0 as X,a4 as oe,a5 as ue,ba as xe,O as Se}from"../chunks/BFZ9LkA7.js";import{b as d,f as w,c as A,t as Ce}from"../chunks/Crl5oi66.js";import{a as M,f as Te,e as ce}from"../chunks/cK4QeKDK.js";import{e as B,i as U,b as Me,s as pe,c as Ae,d as ze}from"../chunks/C-mfHQaF.js";import{e as re}from"../chunks/zvhvVCcK.js";import{c as ne}from"../chunks/CIOv8Qt0.js";import{s as ae,p as G}from"../chunks/C6ZMLTPy.js";import{S as De,c as qe}from"../chunks/C5Cumt4m.js";import{i as Z}from"../chunks/BAUbFhtF.js";import{h as O}from"../chunks/B8s1EM68.js";import{s as Ie}from"../chunks/i_QrQNzF.js";import{b as He}from"../chunks/ByCJWeBO.js";import"../chunks/DlOzM7pa.js";var he={},K={},ee=34,Q=10,te=13;function me(r){return new Function("d","return {"+r.map(function(t,e){return JSON.stringify(t)+": d["+e+'] || ""'}).join(",")+"}")}function Re(r,t){var e=me(r);return function(a,o){return t(e(a),o,r)}}function de(r){var t=Object.create(null),e=[];return r.forEach(function(a){for(var o in a)o in t||e.push(t[o]=o)}),e}function T(r,t){var e=r+"",a=e.length;return a<t?new Array(t-a+1).join(0)+e:e}function Ee(r){return r<0?"-"+T(-r,6):r>9999?"+"+T(r,6):T(r,4)}function je(r){var t=r.getUTCHours(),e=r.getUTCMinutes(),a=r.getUTCSeconds(),o=r.getUTCMilliseconds();return isNaN(r)?"Invalid Date":Ee(r.getUTCFullYear())+"-"+T(r.getUTCMonth()+1,2)+"-"+T(r.getUTCDate(),2)+(o?"T"+T(t,2)+":"+T(e,2)+":"+T(a,2)+"."+T(o,3)+"Z":a?"T"+T(t,2)+":"+T(e,2)+":"+T(a,2)+"Z":e||t?"T"+T(t,2)+":"+T(e,2)+"Z":"")}function Be(r){var t=new RegExp('["'+r+`
\r]`),e=r.charCodeAt(0);function a(n,h){var b,y,m=o(n,function(x,k){if(b)return b(x,k-1);y=x,b=h?Re(x,h):me(x)});return m.columns=y||[],m}function o(n,h){var b=[],y=n.length,m=0,x=0,k,C=y<=0,D=!1;n.charCodeAt(y-1)===Q&&--y,n.charCodeAt(y-1)===te&&--y;function N(){if(C)return K;if(D)return D=!1,he;var W,F=m,H;if(n.charCodeAt(F)===ee){for(;m++<y&&n.charCodeAt(m)!==ee||n.charCodeAt(++m)===ee;);return(W=m)>=y?C=!0:(H=n.charCodeAt(m++))===Q?D=!0:H===te&&(D=!0,n.charCodeAt(m)===Q&&++m),n.slice(F+1,W-1).replace(/""/g,'"')}for(;m<y;){if((H=n.charCodeAt(W=m++))===Q)D=!0;else if(H===te)D=!0,n.charCodeAt(m)===Q&&++m;else if(H!==e)continue;return n.slice(F,W)}return C=!0,n.slice(F,y)}for(;(k=N())!==K;){for(var E=[];k!==he&&k!==K;)E.push(k),k=N();h&&(E=h(E,x++))==null||b.push(E)}return b}function s(n,h){return n.map(function(b){return h.map(function(y){return l(b[y])}).join(r)})}function p(n,h){return h==null&&(h=de(n)),[h.map(l).join(r)].concat(s(n,h)).join(`
`)}function _(n,h){return h==null&&(h=de(n)),s(n,h).join(`
`)}function g(n){return n.map(c).join(`
`)}function c(n){return n.map(l).join(r)}function l(n){return n==null?"":n instanceof Date?je(n):t.test(n+="")?'"'+n.replace(/"/g,'""')+'"':n}return{parse:a,parseRows:o,format:p,formatBody:_,formatRows:g,formatRow:c,formatValue:l}}var Ue=Be(","),Ne=Ue.parse,Pe=w('<section id="demo-link"><h2>Link</h2> <p><a href="elements">Default element styles demo</a></p> <p><a href="fonts">Pudding-hosted font previews</a></p> <p><a href="ui">BitsUI styled components</a></p></section>');function Oe(r){var t=Pe();d(r,t)}var We=w('<section id="demo-image"><h2>Image</h2> <p>img tag</p> <img src="../assets/demo/test.jpg" alt="cat" class="svelte-b56t42"/> <p>background image</p> <div class="svelte-b56t42"></div></section>');function Fe(r){var t=We();d(r,t)}var Je=w('<section id="demo-element"><h2>Dynamic Svelte Element</h2> <!></section>');function Le(r){const t=[{tag:"h3",text:"I am a h3 tag."},{tag:"p",text:"I am p tag."}];var e=Je(),a=f(v(e),2);B(a,17,()=>t,U,(o,s)=>{let p=()=>i(s).tag,_=()=>i(s).text;var g=A(),c=S(g);re(c,p,!1,(l,n)=>{var h=Ce();z(()=>M(h,_())),d(n,h)}),d(o,g)}),u(e),d(r,e)}var Qe=w("<p> </p>");function Ge(r,t){var e=Qe(),a=v(e);u(e),z(()=>M(a,`I am component A and my favorite number is ${t.number??""}.`)),d(r,e)}var $e=w("<p> </p>");function Ye(r,t){var e=$e(),a=v(e);u(e),z(()=>M(a,`I am component B and my name is ${t.name??""}.`)),d(r,e)}var Ze=w('<section id="demo-component"><h2>Dynamic Svelte Component</h2> <!></section>');function Ve(r){const t={A:Ge,B:Ye},e=[{component:"A",number:42},{component:"B",name:"Russell"}];var a=Ze(),o=f(v(a),2);B(o,17,()=>e,U,(s,p)=>{const _=R(()=>t[i(p).component]);var g=A(),c=S(g);ne(c,()=>i(_),(l,n)=>{n(l,ae(()=>i(p)))}),d(s,g)}),u(a),d(r,a)}var Xe=w('<div><p class="svelte-1sxgmm9"> </p></div>'),Ke=w('<section id="scrolly"><h2 class="svelte-1sxgmm9">Scrolly <span> </span></h2> <div class="spacer svelte-1sxgmm9"></div> <!> <div class="spacer svelte-1sxgmm9"></div></section>');function et(r){let t=P(void 0);var e=Ke(),a=v(e),o=f(v(a)),s=v(o,!0);u(o),u(a);var p=f(a,4);De(p,{get value(){return i(t)},set value(_){j(t,_,!0)},children:(_,g)=>{var c=A(),l=S(c);B(l,16,()=>[0,1,2,3,4],U,(n,h,b)=>{const y=R(()=>i(t)===b);var m=Xe();let x;var k=v(m),C=v(k,!0);u(k),u(m),z(()=>{x=Me(m,1,"step svelte-1sxgmm9",null,x,{active:i(y)}),M(C,h)}),d(n,m)}),d(_,c)},$$slots:{default:!0}}),ke(2),u(e),z(()=>M(s,i(t)||"-")),d(r,e)}const tt=`{
  "hed": "A love story",
  "story": [
    {
      "chart_title": "",
      "sort_var": "",
      "metric": "",
      "zoom_id": "524",
      "zoom_label": "",
      "zoom_sprite": "meet",
      "addclass": "hide",
      "bgsprite": "",
      "metric_reverse": "true",
      "text": ""
    },
    {
      "chart_title": "",
      "sort_var": "",
      "metric": "",
      "zoom_id": "524",
      "zoom_label": "",
      "zoom_sprite": "meet",
      "bgsprite": "0",
      "metric_reverse": "true",
      "text": "Once upon a time in the 1960s, an Asian boy and girl met at college. We’ll call them Henry and Mary."
    },
    {
      "chart_title": "",
      "sort_var": "",
      "metric": "",
      "zoom_id": "524",
      "zoom_label": "",
      "zoom_sprite": "date",
      "bgsprite": "1",
      "metric_reverse": "true",
      "text": "A few years later, during an unusually rainy season in January, they started dating."
    },
    {
      "chart_title": "",
      "sort_var": "",
      "metric": "",
      "zoom_id": "524",
      "zoom_label": "",
      "zoom_sprite": "married",
      "bgsprite": "2",
      "metric_reverse": "true",
      "text": "Then a few years after that, they got married."
    },
    {
      "chart_title": "",
      "sort_var": "",
      "metric": "",
      "zoom_id": "524",
      "zoom_label": "",
      "zoom_sprite": "kids",
      "bgsprite": "3",
      "metric_reverse": "true",
      "text": "Eventually they had two kids, bought a single-family home, and built successful careers."
    },
    {
      "chart_title": "",
      "sort_var": "",
      "metric": "",
      "zoom_id": "524",
      "zoom_label": "",
      "zoom_sprite": "thumbsup",
      "metric_reverse": "true",
      "bgsprite": "4",
      "text": "Decades later, in 2017, Henry was asked how his relationship was.\\r\\n\\r\\n\\r\\nHe said it was excellent."
    },
    {
      "chart_title": "",
      "sort_var": "",
      "metric": "",
      "zoom_id": "524",
      "zoom_label": "",
      "zoom_sprite": "married",
      "metric_reverse": "true",
      "bgsprite": "5",
      "text": "This is the template of a love story that many of us dream of living. It involves two people who will build a life together—and work through whatever comes their way.\\r\\n\\r\\n\\r\\nAnd something big is about to come their way."
    },
    {
      "chart_title": "Partnership status, 2017",
      "sort_var": "w1_partnership_status",
      "metric": "",
      "metric_reverse": "true",
      "text": "Henry is one of the thousands of adults Stanford University researchers have been [tracking](https://data.stanford.edu/hcmst2017) since 2017.\\r\\n\\r\\n\\r\\nEvery person on this page answered questions about their relationship status, how they met their partner, and how their relationship is going.\\r\\n\\r\\n\\r\\n<div class=smallText>This piece only visualizes people who participated in all three waves of this survey—2017, 2020, and 2022. More on methodology at the bottom.</div>"
    },
    {
      "chart_title": "Quality of relationship, 2017",
      "sort_var": "w1_partnership_status",
      "metric": "w1_rel_qual_bucket",
      "metric_reverse": "true",
      "text": "Most partnered people said their relationships were <span class=pink>excellent</span> or <span class=purple>good</span>."
    },
    {
      "chart_title": "Quality of relationship, 2017",
      "sort_var": "w1_ppgender",
      "metric": "w1_rel_qual_bucket",
      "metric_reverse": "true",
      "text": "Men were more likely to say their relationship was <span class=pink>excellent</span> ."
    },
    {
      "chart_title": "Quality of relationship, 2017",
      "sort_var": "w1_ppincimp",
      "metric": "w1_rel_qual_bucket",
      "metric_reverse": "true",
      "text": "People with more money tended to report <span class=pink>better relationships</span>. \\r\\n\\r\\n\\r\\nThis is partially because they had more time and resources to devote to their partners, but also because older people earn more money and they’ve had time to find and build good relationships."
    },
    {
      "chart_title": "Quality of relationship, 2017",
      "sort_var": "w1_relate_duration_bucket",
      "metric": "w1_rel_qual_bucket",
      "metric_reverse": "true",
      "text": "And to no one’s surprise, couples who had been together longer were more likely to have <span class=pink>high-quality relationships</span>."
    },
    {
      "chart_title": "Quality of relationship, 2017",
      "sort_var": "w1_relate_duration_bucket",
      "metric": "w1_rel_qual_bucket",
      "metric_reverse": "true",
      "addclass": "longcopy",
      "zoom_sprite": "",
      "text": "But a global pandemic is coming in a few years. Could these relationships endure that upheaval?\\r\\n\\r\\n\\r\\nThere were already some signs that modern relationships were heading in the wrong direction. Over the past several generations, a shrinking percentage of people have said their marriage is “very happy.”\\r\\n\\r\\n\\r\\n>> People who say their marriage is “very happy”|Marriage satisfaction data from GSS|marriagesatisfaction|General Social Survey|https://gssdataexplorer.norc.org/trends?category=Gender%20%26%20Marriage&measure=hapmar\\r\\n\\r\\n\\r\\nFrom 1987 to 2013, both [married couples](https://pubmed.ncbi.nlm.nih.gov/36683860/) and [cohabitating partners](https://link.springer.com/article/10.1007/s11113-025-09982-y) reported more unfairness and disagreement. They also said they interacted less with their partners, [possibly](https://www.theatlantic.com/health/archive/2017/09/we-expect-way-too-much-from-our-romantic-partners/541353/) because many Americans are working longer hours to make ends meet.\\r\\n\\r\\n\\r\\n>> Relationship dynamics from 1987 to 2013|Slope charts showing relationship declines|dynamics|Wright, Brown, and Manning (2023) and Wright, Zugarek, Brown, and Manning (2025)|https://link.springer.com/article/10.1007/s11113-025-09982-y|The measures for the marriage and cohabiting studies are slightly different, so the vertical axes show the minimum and maximum for each measure.\\r\\n\\r\\n\\r\\nFurthermore, a record number of people are [not getting married](https://www.pewresearch.org/short-reads/2023/06/28/a-record-high-share-of-40-year-olds-in-the-us-have-never-been-married/). And single people are [less interested](https://www.rasmussenreports.com/public_content/lifestyle/general_lifestyle/june_2025/dating_37_of_young_singles_aren_t_interested) in pursuing relationships compared to prior generations.\\r\\n\\r\\n\\r\\nSo what would a global pandemic do to American relationships? \\r\\n\\r\\n\\r\\nThe obvious theory was that the [stress](https://pubmed.ncbi.nlm.nih.gov/7644604/) caused by the virus and lockdowns would use up the very energy we need to support our partners through it. And because there was no clear end date, the [chronic stress](https://www.sciencedirect.com/science/article/abs/pii/S2352250X16300690) could break some relationships."
    },
    {
      "chart_title": "",
      "sort_var": "w1_relate_duration_bucket",
      "metric": "",
      "zoom_id": "",
      "zoom_label": "",
      "addclass": "covid",
      "metric_reverse": "true",
      "text": "It’s 2020. People are locked down in their homes. A deadly virus is rapidly spreading around the world."
    },
    {
      "chart_title": "",
      "sort_var": "",
      "metric": "",
      "zoom_id": "524",
      "zoom_label": "",
      "zoom_sprite": "date",
      "metric_reverse": "true",
      "bgsprite": "6",
      "text": "Henry and Mary have agreed that they should socially distance and wear masks in public.\\r\\n\\r\\n\\r\\nThey haven’t fought much during lockdown. They’ve hunkered down, avoided getting sick, and eventually got the vaccine."
    },
    {
      "chart_title": "",
      "sort_var": "",
      "metric": "",
      "zoom_id": "524",
      "zoom_label": "",
      "zoom_sprite": "thumbsup",
      "metric_reverse": "true",
      "bgsprite": "5",
      "text": "In fact, Henry says his relationship is still excellent—just like before.\\r\\n\\r\\n\\r\\nNot a huge surprise, given that they’ve been together for more than 50 years!"
    },
    {
      "chart_title": "Partnership status, 2017",
      "sort_var": "w1_partnership_status",
      "metric": "",
      "addclass": "nocolor",
      "metric_reverse": "true",
      "text": "But what happened to everyone else since 2017?"
    },
    {
      "chart_title": "What happened to relationships from 2017 to 2020",
      "sort_var": "w1_partnership_status",
      "metric": "w2_relationship_end",
      "metric_reverse": "",
      "text": "There were more <span class=pink>divorces</span> and <span class=peach>breakups</span> than normal.\\r\\n\\r\\n\\r\\n>> Breakups and divorces, 2010-13 vs. 2017-20|line chart of breakups|breakups|How Couples Meet and Stay Together 2017|https://data.stanford.edu/hcmst2017",
      "null_value": -1,
      "single_sort_values": [
        3,
        4
      ]
    },
    {
      "chart_title": "How often couples fought in past week, 2020",
      "sort_var": "w2_partner_type",
      "metric": "w2_fight_bucket",
      "metric_reverse": "true",
      "hideNoData": "1",
      "text": "Even among people who stayed together, many said they <span class=magenta>fought</span> with their partner <span class=peach>multiple</span> times in the past week."
    },
    {
      "chart_title": "How relationship quality changed from 2017 to 2020",
      "sort_var": "w2_partner_type",
      "metric": "qual_diff_w1_w2_simple",
      "metric_reverse": "true",
      "text": "In fact, many people rated their relationship <span class=peach>worse</span> in 2020 than three years prior."
    },
    {
      "chart_title": "How relationship quality changed from 2017 to 2020",
      "sort_var": "w2_partner_type",
      "metric": "qual_diff_w1_w2_simple",
      "metric_reverse": "true",
      "addclass": "longcopy",
      "text": "Across human history, we can see how societal disruptions expose the fault lines of our relationships.\\r\\n\\r\\n\\r\\n**For thousands of years**, marriage served mostly a societal function. Aristocrats used it as a tool to consolidate wealth and property across generations. Meanwhile, serfs worked the land for feudal lords, who often controlled their marriages so that couples could be economically viable units.\\r\\n\\r\\n\\r\\n“It was too vital an economic and political institution to be entered into solely on the basis of something as irrational as love,” writes historian Stephanie Coontz in her book, [Marriage, a History](https://www.penguinrandomhouse.com/books/291184/marriage-a-history-by-stephanie-coontz/). \\r\\n\\r\\n\\r\\nBut after the [Black Death](https://www.worldhistory.org/Black_Death/) killed up to half of Europe’s population in the mid-1300s, there was a massive labor shortage and serfs were able to take up trades or jobs that were independent of feudal lords. This meant that there was more freedom and incentive for people to find partners they got along with. “A harmonious, well-functioning marriage was a business necessity as well as a personal pleasure,” Coontz writes.\\r\\n\\r\\n\\r\\n**Eventually in the late-1700s**, people started to marry for love. But that also came with dogmatic beliefs that men and women have innately different natures—that men are better-suited to occupy public life, while women should gracefully uphold the veneer of a happy and functional family.\\r\\n\\r\\n\\r\\nIn the 1930s, the Great Depression threw a wrench into these expectations. When men lost their jobs, women sought out work.\\r\\n\\r\\n\\r\\n“This threatened the ‘modern’ ideas of masculinity and marriage that most men had come to embrace over the previous two decades,” Coontz writes. “Unemployed men often lost their sense of identity and became demoralized. Many turned to drink. Tempers flared at home.”\\r\\n\\r\\n\\r\\n**Ever since the 1960s**, more people have wanted their relationships to be about self-fulfillment. We want our partners to help us be our best selves, rather than playing a societal role. It has freed us from many traditional and often sexist expectations—but we’re also relying more on our relationships than ever before.\\r\\n\\r\\n\\r\\n“Never before in history had societies thought that such a set of high expectations about marriage was either realistic or desirable,” Coontz writes."
    },
    {
      "chart_title": "How relationship quality changed from 2017 to 2020",
      "sort_var": "w2_partner_type",
      "metric": "qual_diff_w1_w2_simple",
      "metric_reverse": "true",
      "text": "So did the high-pressure relationships of modern day really crumble when couples were locked down together?"
    },
    {
      "chart_title": "Relationship quality, 2020",
      "sort_var": "w2_partner_type",
      "metric": "w2_rel_qual_bucket",
      "metric_reverse": "true",
      "text": "The people on this screen are colored by how they rated their relationship in 2020. But once they rated it <span class=pink>excellent</span>, they couldn’t go any higher.\\r\\n\\r\\n\\r\\nSo the Stanford researchers asked another question: How did the pandemic change your relationship?"
    },
    {
      "chart_title": "How the pandemic changed their relationship, 2020",
      "sort_var": "w2_coronavirus_effect_combo",
      "metric": "w2_coronavirus_effect_combo",
      "metric_reverse": "true",
      "hideNoData": "1",
      "text": "It looks like many of these relationships have <span class=pink>improved</span>!"
    },
    {
      "chart_title": "How the pandemic changed their relationship, 2020",
      "sort_var": "w2_rel_qual_bucket",
      "metric": "w2_coronavirus_effect_combo",
      "metric_reverse": "true",
      "hideNoData": "1",
      "text": "In fact, people in excellent relationships were much more likely to say their relationship got even <span class=pink>better</span>."
    },
    {
      "chart_title": "How the pandemic changed their relationship, 2020",
      "sort_var": "w2_rel_qual_bucket",
      "metric": "w2_coronavirus_effect_combo",
      "metric_reverse": "true",
      "hideNoData": "1",
      "text": "Meanwhile, the pandemic was far more likely to <span class=peach>erode</span> the quality of less-than-excellent relationships."
    },
    {
      "chart_title": "How the pandemic changed their relationship, 2022",
      "sort_var": "w3_rel_qual_bucket",
      "metric": "w3_coronavirus_effect_combo",
      "metric_reverse": "true",
      "hideNoData": "1",
      "text": "And two years later, these effects were even stronger: More excellent relationships got <span class=pink>better</span>, while fair or worse relationships <span class=peach>suffered</span>."
    },
    {
      "chart_title": "Agreement on safety measures during the pandemic?",
      "sort_var": "w3_rel_qual_bucket",
      "metric": "w3_covid_complete_agree",
      "metric_reverse": "true",
      "text": "One hint as to what’s going on: Couples in excellent relationships were far more likely to have <span class=pink>complete agreement</span> on what safety measures they should follow during the pandemic.\\r\\n\\r\\n\\r\\nA 63-year-old man [told](https://web.stanford.edu/~mrosenfe/Rosenfeld_Hausen_Resilience_Stress_Soc_Sci_2023.pdf) researchers, “We have given up the outside world to keep each other safe. You see, I love [wife’s name] so much.”"
    },
    {
      "chart_title": "Agreement on safety measures during the pandemic?",
      "sort_var": "w3_rel_qual_bucket",
      "metric": "w3_covid_complete_agree",
      "metric_reverse": "true",
      "addclass": "longcopy",
      "text": "So why did a disruption like the pandemic improve strong relationships, while eroding others?\\r\\n\\r\\n\\r\\nStanford researchers studied these relationships and one thing they [found](https://web.stanford.edu/~mrosenfe/Rosenfeld_Hausen_Resilience_Stress_Soc_Sci_2023.pdf) that functional couples engaged in “mutual meaning making.” They were [resilient](https://onlinelibrary.wiley.com/doi/10.1111/j.1545-5300.2003.00001.x) because they aligned their perspectives on the virus’s risk, and agreed on how they would behave in response to it.\\r\\n\\r\\n\\r\\nAnd when they didn’t?\\r\\n\\r\\n\\r\\n“I want to wear a mask, gloves, limit exposure as much as humanly possible, I wipe down surfaces and use hand sanitizer,” a 22-year-old woman told researchers. “He thinks I’m being, in his words, ‘ridiculous and paranoid.’ “\\r\\n\\r\\n\\r\\nThis wasn’t surprising for relationship experts. Psychologist John Gottman observed thousands of couples during his long career, and he created a framework called the “Sounds Relationship House”—basically the infrastructure of successful couples. And at the very top of this house is creating shared meaning. \\r\\n\\r\\n\\r\\n>> The Sound Relationship House|house with labels|gottman|John Gottman|https://www.gottman.com/blog/the-sound-relationship-house-build-love-maps/\\r\\n\\r\\n\\r\\n“I believe that everyone is a philosopher trying to make some sense out of this brief journey we have through life,” Gottman writes in his book, [The Science of Trust](https://wwnorton.com/books/9780393705959). “People do that in many ways, including creating formal and informal rituals of connection, creating shared goals and life missions, supporting each other’s basic roles in life, and agreeing on the meaning of central values and symbols (like ‘what is a home?’).”\\r\\n\\r\\n\\r\\nPrior societal disruptions revealed cracks in the prevailing relationship models. What did the pandemic expose? Relationship experts have long been anxious that modern relationships require too much of our partners. \\r\\n\\r\\n\\r\\n“Today, we turn to one person to provide what an entire village once did: a sense of grounding, meaning, and continuity,” Esther Perel writes in her book, [Mating in Captivity](https://www.harpercollins.com/products/mating-in-captivity-esther-perel?variant=44338565349410). “Is it any wonder that so many relationships crumble under the weight of it all?”\\r\\n\\r\\n\\r\\nOn one hand, we became free of the institutions and communities that once had power over our relationships—but in turn, they stopped playing a role in our lives."
    },
    {
      "chart_title": "Relationship duration, 2022",
      "sort_var": "w3_relationship_duration_bucket",
      "metric": "",
      "metric_reverse": "true",
      "text": "We can see our love lives becoming more independent and isolated by looking at how people meet.\\r\\n\\r\\n\\r\\nFirst, let’s group everyone by <span class=white>how long their relationship</span> has been."
    },
    {
      "chart_title": "Met at church, 2022",
      "sort_var": "w3_relationship_duration_bucket",
      "metric": "w3_q24_church",
      "metric_reverse": "true",
      "text": "In newer relationships, couples rarely <span class=pink>met at church</span>."
    },
    {
      "chart_title": "Met through coworkers, 2022",
      "sort_var": "w3_relationship_duration_bucket",
      "metric": "w3_met_as_through_cowork",
      "metric_reverse": "true",
      "text": "They rarely <span class=pink>met through coworkers</span>."
    },
    {
      "chart_title": "Met through family, 2022",
      "sort_var": "w3_relationship_duration_bucket",
      "metric": "w3_met_through_family",
      "metric_reverse": "true",
      "text": "They rarely <span class=pink>met through family members</span>."
    },
    {
      "chart_title": "Met through friends, 2022",
      "sort_var": "w3_relationship_duration_bucket",
      "metric": "w3_met_through_friend",
      "metric_reverse": "true",
      "text": "And they less frequently <span class=pink>met through friends</span>."
    },
    {
      "chart_title": "Met online, 2022",
      "sort_var": "w3_relationship_duration_bucket",
      "metric": "w3_Q32_simple",
      "metric_reverse": "true",
      "text": "As you already know, the most common way people meet these days is <span class=pink>online</span>, mostly through dating apps.\\r\\n\\r\\n\\r\\n>>|two line charts showing people meet online now|howmeet|How Couples Meet and Stay Together 2017|https://data.stanford.edu/hcmst2017|Five-year rolling averages",
      "null_value": -1,
      "keep_null_sort": true
    },
    {
      "chart_title": "Shared connections, 2022",
      "sort_var": "w3_relationship_duration_bucket",
      "metric": "w3_no_friend_overlap",
      "metric_reverse": "true",
      "text": "This means people are less likely to <span class=pink>know the same people</span> prior to meeting.\\r\\n\\r\\n\\r\\nThey’re on a social island, for better or worse."
    },
    {
      "chart_title": "Shared connections, 2022",
      "sort_var": "w3_relationship_duration_bucket",
      "metric": "w3_no_friend_overlap",
      "metric_reverse": "true",
      "addclass": "longcopy",
      "text": "Pandemic lockdowns accentuated this isolation. Some couples were able to endure the towering expectations of their partnership, but many were not.\\r\\n\\r\\n\\r\\n“Modern relationships are cauldrons of contradictory longings: safety and excitement, grounding and transcendence, the comfort of love and the heat of passion. We want it all, and we want it with one person,” Perel writes.\\r\\n\\r\\n\\r\\nIt’s uncomfortable for me to read about how we’re *too* reliant on our partners. It feels like a critique of the relationship I’ve built with the most important person in my life—a relationship that has helped us survive an increasingly precarious and anti-social world.\\r\\n\\r\\n\\r\\nBut our history reveals that love stories are shaped by the world in which we live—and they’ve always come with tradeoffs. We once married people for survival, which provided stability but not emotional satisfaction. We then married for companionship, which traded stability for love but at the cost of rigid gender roles. And now we want our partners to fulfill a wide array of emotional, physical, and existential needs—but that can be an overwhelming task.\\r\\n\\r\\n\\r\\nYet I can’t stop thinking about all the conversations I’ve had about relationships while working on this story. People have suggested readings, told me anecdotes, and shared anxieties. All of them were wrestling, in their own way, with what it means to love someone in a world where we have to ask so much of one person. And they’ve made themselves vulnerable as they shared how they’re trying to make it work. Maybe the village is still here."
    },
    {
      "chart_title": "",
      "sort_var": "",
      "metric": "",
      "metric_reverse": "true",
      "addclass": "explore",
      "text": "**Explore the data** \\r\\n\\r\\n\\r\\n<div class=smallText>These icons each represent one person in the survey, and do not reflect the survey weights that researchers use to produce a representative analysis. Read more about this in the methodology below.</div>"
    }
  ],
  "methods": "The data for this story is from [How Couples Meet and Stay Together](https://data.stanford.edu/hcmst2017), which surveyed Americans in 2017, 2020, and 2022. To get a representative analysis, the researchers weighted each respondent based on demographic characteristics. But the main icon visualization represents each person as one icon. All of the icon visualizations in this piece reflect the general results of a weighted analysis, but the exact numbers may differ. The individual charts are produced using the representative weights.\\r\\n\\r\\n\\r\\nSpecial thanks to [Amanda Sakuma](https://amandasakuma.com/) for making the clothes for the claymation icons.\\r\\n\\r\\n\\r\\n<h6>Data citation</h6>\\r\\nRosenfeld, Michael J., Reuben J. Thomas, and Sonia Hausen. 2023. How Couples Meet and Stay Together 2017-2020-2022 combined dataset. [Computer files]. Stanford, CA: Stanford University Libraries. https://data.stanford.edu/hcmst2017",
  "colors": {}
}`;var rt=w("<p></p>"),nt=w('<details><summary></summary> <div class="content"><!></div></details>');function at(r,t){let e=R(()=>typeof t.content=="string"),a=R(()=>t.open==="true");var o=nt(),s=v(o);O(s,()=>t.summary,!0),u(s);var p=f(s,2),_=v(p);{var g=l=>{var n=A(),h=S(n);O(h,()=>t.content),d(l,n)},c=l=>{var n=A(),h=S(n);B(h,17,()=>t.content,U,(b,y)=>{let m=()=>i(y).value;var x=rt();O(x,m,!0),u(x),d(b,x)}),d(l,n)};Z(_,l=>{i(e)?l(g):l(c,-1)})}u(p),u(o),z(()=>{o.open=i(a),pe(o,"name",t.name)}),d(r,o)}var ot=w("<li></li>"),st=w("<ul></ul>");function it(r,t){var e=st();B(e,21,()=>t.li,U,(a,o)=>{var s=ot();O(s,()=>i(o),!0),u(s),d(a,s)}),u(e),d(r,e)}var lt=w("<li></li>"),ct=w("<ol></ol>");function ht(r,t){var e=ct();B(e,21,()=>t.li,U,(a,o)=>{var s=lt();O(s,()=>i(o),!0),u(s),d(a,s)}),u(e),d(r,e)}var dt=w("<p></p>"),ut=w("<section><!></section>");function pt(r,t){V(t,!0);const e={details:at,ul:it,ol:ht};let a=G(t,"components",19,()=>({})),o=G(t,"body",19,()=>[]);var s=A(),p=S(s);B(p,17,o,U,(_,g)=>{let c=()=>i(g).section,l=()=>i(g).content;const n=R(()=>c().toLowerCase().replace(/[^a-z0-9]/g,"")),h=R(()=>a()[c()]);var b=ut(),y=v(b);{var m=k=>{var C=A(),D=S(C);ne(D,()=>i(h),(N,E)=>{E(N,ae(l))}),d(k,C)},x=k=>{var C=A(),D=S(C);B(D,17,l,U,(N,E,W,F)=>{let H=()=>i(E).type,J=()=>i(E).value;const se=R(()=>a()[H()]||e[H()]),ve=R(()=>typeof J()=="string");var ie=A(),_e=S(ie);{var fe=q=>{var I=A(),L=S(I);ne(L,()=>i(se),($,Y)=>{Y($,ae(J))}),d(q,I)},ge=q=>{var I=dt();O(I,J,!0),u(I),d(q,I)},we=q=>{var I=A(),L=S(I);re(L,H,!1,($,Y)=>{var le=A(),be=S(le);O(be,J),d(Y,le)}),d(q,I)},ye=q=>{var I=A(),L=S(I);re(L,H,!1,($,Y)=>{Ae($,()=>({...J()}))}),d(q,I)};Z(_e,q=>{i(se)?q(fe):H()==="text"?q(ge,1):i(ve)?q(we,2):q(ye,-1)})}d(N,ie)}),d(k,C)};Z(y,k=>{i(h)?k(m):k(x,-1)})}u(b),z(()=>pe(b,"id",i(n))),d(_,b)}),d(r,s),X()}var mt=w('<p> </p> <progress max="100"></progress>',1);function vt(r,t){let e=G(t,"label",3,"A"),a=G(t,"value",3,0);var o=mt(),s=S(o),p=v(s,!0);u(s);var _=f(s,2);z(()=>{M(p,e()),ze(_,a())}),d(r,o)}var _t=w('<section id="cms"><h2>MicroCMS</h2> <code><pre> </pre></code> <!></section>');function ft(r,t){V(t,!0);const{body:e}=qe,a={Test:vt};var o=_t(),s=f(v(o),2),p=v(s),_=v(p,!0);u(p),u(s);var g=f(s,2);pt(g,{get components(){return a},get body(){return e}}),u(o),z(c=>M(_,c),[()=>tt.replace(/\t/g," ")]),d(r,o),X()}const gt=(r,t=ue)=>{var e=wt(),a=v(e),o=v(a,!0);u(a);var s=f(a,2),p=v(s,!0);u(s),u(e),z(()=>{M(o,t().name),M(p,t().age)}),d(r,e)};var wt=w('<div class="person svelte-q3gttf"><p class="svelte-q3gttf"> </p> <p class="svelte-q3gttf"> </p></div>'),yt=w('<h2>Svelte5</h2> <h3>Reactive variables 3 ways:</h3> <button class="svelte-q3gttf">count++</button> <p class="svelte-q3gttf"> </p> <p class="svelte-q3gttf"> </p> <p class="svelte-q3gttf"> </p> <h3>Children (previously slots):</h3> <div class="children"><!></div> <h3>Dispatch Event</h3> <button class="svelte-q3gttf">Random</button>  <h3>Snippets</h3> <div class="people svelte-q3gttf"></div>',1);function bt(r,t){V(t,!0),G(t,"age",3,30);const e=[{name:"John",age:30},{name:"Jill",age:45}];let a=P(0),o=R(()=>i(a)*2),s=R(()=>i(a)*2),p=P(0);oe(()=>{j(p,i(a)*2)});var _=yt(),g=f(S(_),4),c=f(g,2),l=v(c);u(c);var n=f(c,2),h=v(n);u(n);var b=f(n,2),y=v(b);u(b);var m=f(b,4),x=v(m);Ie(x,()=>t.children??ue),u(m);var k=f(m,4),C=f(k,4);B(C,21,()=>e,U,(D,N)=>{gt(D,()=>i(N))}),u(C),z(()=>{M(l,`${i(a)??""} doubled is ${i(o)??""} (derived)`),M(h,`${i(a)??""} doubled is ${i(s)??""} (derived by)`),M(y,`${i(a)??""} doubled is ${i(p)??""} ($effect)`)}),ce("click",g,()=>xe(a)),ce("click",k,()=>t.random(Math.floor(Math.random()*10))),d(r,_),X()}Te(["click"]);const kt=(r,t)=>{let e=P(Se(r)),a=P(null),o=P(!0),s=P(void 0);const p=(c=!0)=>{j(o,c,!0),c===!0&&(j(s,null),j(a,null))},_=async()=>{try{const c=await fetch(i(e),t);if(!c.ok)throw new Error(`Unexpected error occurred (status ${c.status})`);let l;if(i(e).includes(".csv")){const n=await c.text();l=Ne(n)}else l=await c.json();return[null,l]}catch(c){const{errorMessage:l="Unexpected error eccurred"}=c;return[l,null]}},g=async c=>{p(!0);const[l,n]=await _();if(c===i(e)){if(l){p(!1),j(s,l,!0);return}p(!1),j(a,n,!0)}};return oe(()=>{g(i(e))}),{get data(){return i(a)},get loading(){return i(o)},get error(){return i(s)},get url(){return i(e)},set url(c){i(e)!==c&&j(e,c,!0)}}};var xt=w("<p>loading data...</p>"),St=w("<p> </p>"),Ct=w("<p>data loaded</p> <pre> </pre>",1),Tt=w('<div class="c"><h2>Load Data</h2> <div class="response"><!></div></div>');function Mt(r,t){V(t,!0);const e=`${He}/assets/demo/test.csv`,a=kt(e);oe(()=>{});var o=Tt(),s=f(v(o),2),p=v(s);{var _=l=>{var n=xt();d(l,n)},g=l=>{var n=St(),h=v(n);u(n),z(()=>M(h,`error: ${a.error??""}`)),d(l,n)},c=l=>{var n=Ct(),h=f(S(n),2),b=v(h,!0);u(h),z(y=>M(b,y),[()=>JSON.stringify(a.data,null,2)]),d(l,n)};Z(p,l=>{a.loading?l(_):a.error?l(g,1):l(c,-1)})}u(s),u(o),d(r,o),X()}var At=w('<div id="demo" class="svelte-15aotx7"><h1>Demo</h1> <!> <!> <!> <!> <!> <!> <!> <!></div>');function zt(r){let t=P(0);function e(h){console.log(h)}var a=At(),o=f(v(a),2);Oe(o);var s=f(o,2);Fe(s);var p=f(s,2);Le(p);var _=f(p,2);Ve(_);var g=f(_,2);ft(g,{});var c=f(g,2);Mt(c,{});var l=f(c,2);et(l);var n=f(l,2);bt(n,{random:e,get value(){return i(t)},set value(h){j(t,h,!0)}}),u(a),d(r,a)}function Jt(r){zt(r)}export{Jt as component};
