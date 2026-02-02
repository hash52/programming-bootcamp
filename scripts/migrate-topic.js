const fs = require('fs');
const path = require('path');

const topics = {
  '01_java_basics': {
    map: {
      'k1.mdx': 'execution_order.mdx',
      'k2.mdx': 'readable_code.mdx',
      'k3.mdx': 'brace_role.mdx',
      'k4.mdx': 'java_use_cases.mdx',
      'w5.mdx': 'hello_world.mdx',
      'w6.mdx': 'run_in_eclipse.mdx',
      'w7.mdx': 'print_name_and_age.mdx'
    }
  },
  '02_variables_and_types': {
    map: {
      'k1.mdx': 'variables_concept.mdx',
      'k2.mdx': 'type_basics.mdx',
      'k3.mdx': 'int_type_data.mdx',
      'k4.mdx': 'double_type_data.mdx',
      'k5.mdx': 'string_type_data.mdx',
      'k6.mdx': 'boolean_type_data.mdx',
      'k7.mdx': 'assignment_concept.mdx',
      'w1.mdx': 'declare_variable.mdx',
      'w8.mdx': 'declare_int_variable.mdx',
      'w9.mdx': 'declare_double_variable.mdx',
      'w10.mdx': 'declare_boolean_variable.mdx',
      'w11.mdx': 'declare_string_variable.mdx',
      'w12.mdx': 'variable_naming.mdx',
      'w13.mdx': 'type_casting.mdx',
      'k14.mdx': 'variable_scope.mdx',
      'w15.mdx': 'declare_constant.mdx',
      'r16.mdx': 'read_type_compatibility.mdx'
    }
  },
  '03_operators': {
    map: {
      'k1.mdx': 'arithmetic_operators_concept.mdx',
      'k2.mdx': 'comparison_operators_concept.mdx',
      'k3.mdx': 'logical_operators_concept.mdx',
      'k4.mdx': 'increment_decrement_concept.mdx',
      'w5.mdx': 'basic_arithmetic.mdx',
      'w6.mdx': 'modulo_operation.mdx',
      'k7.mdx': 'integer_division_result.mdx',
      'w8.mdx': 'compound_assignment.mdx',
      'w9.mdx': 'value_comparison.mdx',
      'w10.mdx': 'combine_conditions.mdx',
      'w11.mdx': 'invert_condition.mdx',
      'w12.mdx': 'increment_decrement_value.mdx',
      'r13.mdx': 'read_calculation_result.mdx'
    }
  },
  '03a_scanner': {
    map: {
      'k1.mdx': 'stdin_concept.mdx',
      'k2.mdx': 'scanner_class_role.mdx',
      'k3.mdx': 'string_vs_int_reading.mdx',
      'w4.mdx': 'input_from_keyboard.mdx',
      'w5.mdx': 'prepare_scanner.mdx',
      'w6.mdx': 'read_line.mdx',
      'w7.mdx': 'read_integer.mdx',
      'w8.mdx': 'read_double.mdx',
      'k9.mdx': 'after_nextint_caution.mdx',
      'w10.mdx': 'handle_invalid_input.mdx'
    }
  },
  '03b_random': {
    map: {
      'k1.mdx': 'random_concept.mdx',
      'k2.mdx': 'random_class_role.mdx',
      'k3.mdx': 'nextint_argument_meaning.mdx',
      'w4.mdx': 'generate_random_number.mdx',
      'w5.mdx': 'prepare_random_class.mdx',
      'w6.mdx': 'random_0_to_9.mdx',
      'w7.mdx': 'random_1_to_100.mdx',
      'w8.mdx': 'random_double.mdx',
      'k9.mdx': 'random_seed_concept.mdx',
      'w10.mdx': 'random_from_array.mdx'
    }
  }
};

const baseDir = 'c:\\Users\\hashi\\workspace\\curriculum\\programming-bootcamp\\docs\\src\\questions\\java\\basics';

for (const [topicId, { map }] of Object.entries(topics)) {
  const topicDir = path.join(baseDir, topicId);
  
  console.log(`\n=== Processing ${topicId} ===`);
  
  // Step 1: Rename files
  for (const [oldName, newName] of Object.entries(map)) {
    const oldPath = path.join(topicDir, oldName);
    const newPath = path.join(topicDir, newName);
    
    if (fs.existsSync(oldPath)) {
      fs.renameSync(oldPath, newPath);
      console.log(`Renamed: ${oldName} -> ${newName}`);
    }
  }
  
  // Step 2: Update frontmatter IDs
  for (const [oldName, newName] of Object.entries(map)) {
    const filePath = path.join(topicDir, newName);
    const questionId = path.basename(newName, '.mdx');
    
    if (fs.existsSync(filePath)) {
      let content = fs.readFileSync(filePath, 'utf8');
      const newId = `java/basics/${topicId}#${questionId}`;
      content = content.replace(/^id: "[^"]+"/m, `id: "${newId}"`);
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated ID: ${questionId}`);
    }
  }
  
  console.log(`${topicId} completed!`);
}

console.log('\n✅ All topics migrated successfully!');
