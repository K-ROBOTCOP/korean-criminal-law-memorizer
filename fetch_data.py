import xml.etree.ElementTree as ET
import json

def parse_law(xml_file, output_json):
    tree = ET.parse(xml_file)
    root = tree.getroot()
    
    hierarchy = []
    
    current_part = None
    current_chapter = None
    current_section = None
    
    for jomun_unit in root.findall('.//조문단위'):
        jomun_type = jomun_unit.find('조문여부').text if jomun_unit.find('조문여부') is not None else ''
        
        if jomun_type == '전문':
            content_elem = jomun_unit.find('조문내용')
            if content_elem is not None and content_elem.text:
                content = content_elem.text.strip()
                
                if content.startswith('제') and '편' in content and not '장' in content[:10]:
                    current_part = {'type': 'part', 'title': content, 'children': []}
                    hierarchy.append(current_part)
                    current_chapter = None
                    current_section = None
                elif content.startswith('제') and '장' in content and not '절' in content[:10]:
                    current_chapter = {'type': 'chapter', 'title': content, 'children': []}
                    if current_part is not None:
                        current_part['children'].append(current_chapter)
                    else:
                        hierarchy.append(current_chapter)
                    current_section = None
                elif content.startswith('제') and '절' in content:
                    current_section = {'type': 'section', 'title': content, 'children': []}
                    if current_chapter is not None:
                        current_chapter['children'].append(current_section)
                    elif current_part is not None:
                        current_part['children'].append(current_section)
                    else:
                        hierarchy.append(current_section)
        
        elif jomun_type == '조문':
            jomun_num_elem = jomun_unit.find('조문번호')
            jomun_title_elem = jomun_unit.find('조문제목')
            jomun_content_elem = jomun_unit.find('조문내용')
            
            article_num = jomun_num_elem.text if jomun_num_elem is not None else ''
            title = jomun_title_elem.text if jomun_title_elem is not None else ''
            content = jomun_content_elem.text.strip() if jomun_content_elem is not None and jomun_content_elem.text else ''
            
            paragraphs = []
            for hang in jomun_unit.findall('항'):
                hang_content = hang.find('항내용')
                if hang_content is not None and hang_content.text:
                    paragraphs.append(hang_content.text.strip())
                    
                for ho in hang.findall('호'):
                    ho_content = ho.find('호내용')
                    if ho_content is not None and ho_content.text:
                        paragraphs.append('  ' + ho_content.text.strip())
            
            for child in jomun_unit:
                if child.tag == '호':
                    ho_content = child.find('호내용')
                    if ho_content is not None and ho_content.text:
                        paragraphs.append('  ' + ho_content.text.strip())
            
            article = {
                'type': 'article',
                'article_num': article_num,
                'title': title,
                'content': content,
                'paragraphs': paragraphs
            }
            
            if current_section is not None:
                current_section['children'].append(article)
            elif current_chapter is not None:
                current_chapter['children'].append(article)
            elif current_part is not None:
                current_part['children'].append(article)
            else:
                hierarchy.append(article)

    with open(output_json, 'w', encoding='utf-8') as f:
        json.dump(hierarchy, f, ensure_ascii=False, indent=2)
        
    print(f"Successfully parsed {len(hierarchy)} top-level items into {output_json}")

if __name__ == "__main__":
    parse_law('law.xml', 'criminal_act.json')
